from spacy.lang.ar import Arabic
import re

class SentenceHandler(object):

    def __init__(self, language=Arabic):
        self.nlp = language()
        self.nlp.add_pipe('sentencizer')

    def process(self, body: str, min_length: int = 40, max_length: int = 600):
        """
        Processes the content sentences.

        :param body: The raw string body to process
        :param min_length: Minimum length that the sentences must be
        :param max_length: Max length that the sentences mus fall under
        :return: Returns a list of sentences.
        """
        doc = self.nlp(body)
        return [c.text.strip() for c in doc.sents if max_length > len(c.text.strip()) > min_length]

    def __call__(self, body: str, min_length: int = 40, max_length: int = 600):
        return self.process(body, min_length, max_length)
