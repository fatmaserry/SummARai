from summarizer import Summarizer
from spacy.lang.ar import Arabic
import pickle
import nltk
import networkx as nx
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from rouge import Rouge


class ExtractiveService:
    def __init__(self):
        self.extractiveModel = pickle.load(open("extractiveModel.pkl", 'rb'))
        self.dic = {}
        self.chunk = 0
        nltk.download('stopwords')
        from nltk.corpus import stopwords
        self.arabic_stopwords = set(stopwords.words('arabic'))

    def normalize_arabic(self, text):
        text = re.sub(r"[إأآا]", "ا", text)
        text = re.sub(r"ى", "ي", text)
        text = re.sub(r"ؤ", "و", text)
        text = re.sub(r"ئ", "ي", text)
        text = re.sub(r"ة", "ه", text)
        # text = re.sub(r"[^\w\s]", "", text)
        text = re.sub("\n", " ", text)
        return text

    def preprocess_sentences(self, text):
        # Split by Arabic sentence-ending punctuation
        raw_sentences = re.split(r'(?<=[.!؟])\s+', text)
        cleaned = []
        for s in raw_sentences:
            s = s.strip()
            if s:
                norm = self.normalize_arabic(s)
                cleaned.append(norm)
        return cleaned

    def arabic_tokenizer(self, text):
        words = text.split()
        return [w for w in words if w not in self.arabic_stopwords]

    def summarize_arabic_text(self, text, num_sentences=3):
        sentences = self.preprocess_sentences(text)

        vectorizer = TfidfVectorizer(tokenizer=self.arabic_tokenizer)
        tfidf_matrix = vectorizer.fit_transform(sentences)

        sim_matrix = cosine_similarity(tfidf_matrix)
        graph = nx.from_numpy_array(sim_matrix)
        scores = nx.pagerank(graph)

        # Top-ranked sentence indices
        scored = [(i, scores[i]) for i in range(len(sentences))]
        top_indices = sorted(scored, key=lambda x: x[1], reverse=True)[:int(len(scored) * 0.5) + 1]

        # Sort by original order
        top_indices_sorted = sorted(top_indices, key=lambda x: x[0])
        summary = [sentences[i] for i, _ in top_indices_sorted]

        return "\n".join(summary)

    def preprocessing(self, text: str) -> str:
        text = re.sub(r'#', '', text)
        max_length = 600
        new_text = []

        sentences = re.split(r'(?<=[.])\s*', text)

        for sent in sentences:
            sent = sent.strip()
            if len(sent) <= max_length:
                new_text.append(sent)
                continue

            # If sentence is too long, split using Arabic punctuation
            sub_sentences = re.split(r'(?<=[،.؟])\s*', sent)
            sub_sentences = [s.strip() for s in sub_sentences if s.strip()]
            total_len = sum(len(s) for s in sub_sentences)

            chunks = []
            chunk = ""

            size_per_chunk = (total_len + max_length - 1) // max_length

            for s in sub_sentences:
                punctuation = s[-1] if s[-1] in "،؟" else ""
                content = s[:-1] if punctuation else s

                if punctuation:
                    self.dic[content] = punctuation

                if len(chunk) + len(content) >= size_per_chunk:
                    chunks.append(chunk.strip() + ".")
                    chunk = ""

                chunk += content + " "

            if chunk:
                chunks.append(chunk.strip())

            new_text.extend(chunks)

        return " ".join(new_text)

    def postprocessing(self, text: str) -> str:
        sentences = re.split(r'(?<=[،.؟])\s*', text)
        restored = []

        for sent in sentences:
            sent = sent.strip()
            if not sent:
                continue
            if len(sent) > 1 and sent[-1] == ".":
                content = sent[:-1].strip()
                punct = self.dic.get(content)
                if punct:
                    restored.append(content + punct)
                else:
                    restored.append(sent)
            else:
                restored.append(sent)

        self.dic.clear()
        return " ".join(restored)

    def getSummary(self, text: str):
        # convertingToDot = self.preprocessing(text)
        summary = self.summarize_arabic_text(text)
        # reconvert = self.postprocessing(summary)
        # print(str(self.chunk) + " Done")
        # self.chunk += 1
        return summary
