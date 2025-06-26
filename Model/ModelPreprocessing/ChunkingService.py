import re
import spacy
from transformers import AutoTokenizer
import re
from transformers import AutoTokenizer
import spacy
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


class ChunkingService:
    def __init__(self):
        self.nlp = spacy.blank('ar')
        self.nlp.add_pipe('sentencizer')
        self.tokenizer = AutoTokenizer.from_pretrained("aubmindlab/bert-base-arabertv02")
        self.semantic_model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

    def get_tokens(self,text):
        tokens = self.tokenizer(text, return_tensors="pt").input_ids
        token_count = tokens.shape[1]
        return token_count

    async def semantic_chunk_using_spacy(self,text, max_chunk_size=900, min_chunk_size=600):
        """
        Enhanced chunking with basic semantic awareness.
        Falls back to regular chunking if semantic model not available.

        Parameters:
        - text: The input text to chunk
        - max_chunk_size: Maximum tokens per chunk (hard limit)
        - min_chunk_size: Minimum tokens for a chunk before considering merging

        The function ensures that:
        1. No chunk exceeds max_chunk_size
        2. Tries to keep chunks above min_chunk_size when possible
        3. Preserves semantic relationships while respecting size constraints
        """

        try:
            doc = self.nlp(text)
            sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]

            if len(sentences) < 2:
                text_tokens = self.get_tokens(text.strip())
                if text_tokens > max_chunk_size:
                    print(f"Warning: Single text chunk exceeds max size ({text_tokens} > {max_chunk_size})")
                    return self.chunk_using_spacy(text, max_chunk_size, min_chunk_size)
                return [text] if text.strip() else []

            # Get embeddings for all sentences
            embeddings = self.semantic_model.encode(sentences)
            similarity_matrix = cosine_similarity(embeddings)

            chunks = []
            current_chunk = ""
            last_sent_idx = -1

            for i, sent in enumerate(sentences):
                sent = sent.strip()
                if not sent:
                    continue

                sent_tokens = self.get_tokens(sent)

                # Handle very long sentences
                if sent_tokens >= max_chunk_size:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                        current_chunk = ""
                    print(f"Warning: Long sentence found ({sent_tokens} tokens)")
                    print(sent)
                    chunks.append(sent)
                    continue

                # Check if adding this sentence would exceed max size
                potential_chunk = current_chunk + " " + sent if current_chunk else sent
                potential_tokens = self.get_tokens(potential_chunk)

                if potential_tokens >= max_chunk_size:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                    current_chunk = sent
                    last_sent_idx = i
                else:
                    # Check semantic similarity with previous sentence
                    if current_chunk and i > 0 and last_sent_idx >= 0:
                        similarity = similarity_matrix[i][last_sent_idx]
                        # Break on semantic boundary if chunk is large enough
                        if similarity < 0.2 and self.get_tokens(current_chunk) >= min_chunk_size:
                            chunks.append(current_chunk.strip())
                            current_chunk = sent
                            last_sent_idx = i
                            continue

                    current_chunk = potential_chunk
                    last_sent_idx = i

            # Handle the final chunk
            if current_chunk:
                current_tokens = self.get_tokens(current_chunk)

                # If final chunk is too small and we have other chunks, try to merge
                if current_tokens < min_chunk_size and chunks:
                    # Get embedding for current chunk
                    current_embedding = self.semantic_model.encode([current_chunk])
                    chunk_embeddings = self.semantic_model.encode(chunks)
                    similarities = cosine_similarity(current_embedding, chunk_embeddings)[0]

                    # Find best merge candidate
                    best_idx = -1
                    best_similarity = -1

                    for idx, (chunk, similarity) in enumerate(zip(chunks, similarities)):
                        merged_size = self.get_tokens(chunk + " " + current_chunk)
                        if merged_size <= max_chunk_size and similarity > best_similarity:
                            best_idx = idx
                            best_similarity = similarity

                    if best_idx != -1 and best_similarity > 0.3:
                        merged_chunk = chunks[best_idx] + " " + current_chunk
                        merged_tokens = self.get_tokens(merged_chunk)
                        if merged_tokens <= max_chunk_size:
                            chunks[best_idx] = merged_chunk.strip()
                        else:
                            chunks.append(current_chunk.strip())
                    else:
                        chunks.append(current_chunk.strip())
                else:
                    chunks.append(current_chunk.strip())

            # Final validation of chunk sizes
            final_chunks = []
            for chunk in chunks:
                chunk_tokens = self.get_tokens(chunk)
                if chunk_tokens > max_chunk_size:
                    print(f"Warning: Oversized chunk detected ({chunk_tokens} tokens)")
                    final_chunks.extend(self.chunk_using_spacy(chunk, max_chunk_size, min_chunk_size))
                else:
                    final_chunks.append(chunk)

            return final_chunks

        except Exception as e:
            print(f"Semantic chunking failed: {e}, falling back to basic chunking")
            return self.chunk_using_spacy(text, max_chunk_size, min_chunk_size)

    def chunk_using_spacy(self,text, max_chunk_size=800, min_chunk_size=600):
        """Basic chunking without semantics"""
        doc = self.nlp(text)
        chunks = []
        current_chunk = ""

        for sent in doc.sents:
            sent_text = sent.text.strip()
            if not sent_text:
                continue

            sent_tokens = self.get_tokens(sent_text)

            # Handle very long sentences by splitting them if possible
            if sent_tokens >= max_chunk_size:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                    current_chunk = ""
                chunks.append(sent_text)
                continue

            # Check if adding this sentence would exceed max size
            potential_chunk = current_chunk + " " + sent_text if current_chunk else sent_text
            potential_tokens = self.get_tokens(potential_chunk)

            if potential_tokens >= max_chunk_size:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = sent_text
            else:
                current_chunk = potential_chunk

        # Add final chunk if it exists
        if current_chunk:
            chunks.append(current_chunk.strip())

        return chunks
    # using spacy library
    # async def chunk_using_spacy(self, text):
    #     doc = self.nlp(text)
    #     cur = ""
    #     ret = []
    #     tot = 0
    #     mxSentenceTokens = 0
    #     mxSentenceLen = 0
    #     for sent in doc.sents:
    #         cur += sent.text.strip()
    #         mxSentenceTokens = max(mxSentenceTokens, self.get_tokens(sent.text.strip()))
    #         mxSentenceLen = max(mxSentenceLen, len(sent.text.strip()))
    #         s = self.get_tokens(cur)
    #         if s >= 400:
    #             tot += s
    #             ret.append(cur)
    #             cur = ""
    #     if cur != "":
    #         ret.append(cur)
    #         tot += self.get_tokens(cur)
    #     print(tot)
    #     print(mxSentenceLen)
    #     print(mxSentenceTokens)
    #     return ret


    async def overlapping_chunking(self, text, chunk_size=400, overlap=100):
        doc = self.nlp(text)
        sentences = list(doc.sents)
        ret = []
        i = 0
        while i < len(sentences):
            cur_chunk = []
            token_count = 0
            j = i
            # Add sentences until token count exceeds chunk_size
            while j < len(sentences) and token_count < chunk_size:
                sent_text = sentences[j].text
                cur_chunk.append(sent_text)
                token_count += self.get_tokens(sent_text)
                j += 1

            ret.append(' '.join(cur_chunk))
            if j >= len(sentences):
                break
            # Overlap
            token_count = 0
            j -= 1
            while j >= 0 and token_count < overlap:
                sent_text = sentences[j].text
                token_count += self.get_tokens(sent_text)
                j -= 1
            i = max(i + 1, j + 1)

        return ret