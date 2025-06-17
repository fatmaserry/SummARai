from summarizer import Summarizer
import pickle


class ExtractiveService:
    def __init__(self):
        self.extractiveModel = pickle.load(open("extractiveModel.pkl", 'rb'))

    def getSummary(self,text : str):
        summary = self.extractiveModel(text)
        return summary
