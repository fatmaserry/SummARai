import re
import spacy
from transformers import AutoTokenizer

class ChunkingService:
    def __init__(self):
        self.nlp = spacy.blank('ar')
        self.nlp.add_pipe('sentencizer')
        self.tokenizer = AutoTokenizer.from_pretrained("aubmindlab/bert-base-arabertv02")

    def get_tokens(self,text):
        tokens = self.tokenizer(text, return_tensors="pt").input_ids
        token_count = tokens.shape[1]
        return token_count

    # using spacy library
    async def chunk_using_spacy(self, text):
        doc = self.nlp(text)
        cur = ""
        ret = []
        tot = 0
        mxSentenceTokens = 0
        mxSentenceLen = 0
        for sent in doc.sents:
            cur += sent.text.strip()
            mxSentenceTokens = max(mxSentenceTokens, self.get_tokens(sent.text.strip()))
            mxSentenceLen = max(mxSentenceLen, len(sent.text.strip()))
            s = self.get_tokens(cur)
            if s >= 400:
                tot += s
                ret.append(cur)
                cur = ""
        if cur != "":
            ret.append(cur)
            tot += self.get_tokens(cur)
        print(tot)
        print(mxSentenceLen)
        print(mxSentenceTokens)
        return ret


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