import time

from transformers import AutoTokenizer

from AbstractiveService import AbstractiveService
from ChunkingService import ChunkingService
from ExtractiveService import ExtractiveService
from OCRService import OCRService
from fastapi import UploadFile

class SummarizationService:
    def __init__(self):
        self.ocr_service = OCRService()
        self.chunking_service = ChunkingService()
        self.extractiveService = ExtractiveService()
        self.abstractiveService = AbstractiveService()
        self.tokenizer = AutoTokenizer.from_pretrained("aubmindlab/bert-base-arabertv02")


    def get_tokens(self,text):
        tokens = self.tokenizer(text, return_tensors="pt").input_ids
        token_count = tokens.shape[1]
        return token_count



    async def run(self, file : UploadFile):
        start_total = time.perf_counter()
        fullText = await self.ocr_service.process_pdf(file)
        print("OCR Done")
        chunks = await self.chunking_service.chunk_using_spacy(fullText)
        print("Chunking Done")
        extractiveSummary = []
        for chunk in chunks:
            extractiveSummary.append(self.extractiveService.getSummary(chunk) + "\n")
        print("Extractive Summary Done")
        cur = ""
        cnt = 1
        abstractiveSummary = []
        for chunk in extractiveSummary:
            if self.get_tokens(cur) + self.get_tokens(chunk) > 1024:
                cnt += 1
                abstractiveSummary.append(cur)
                cur = chunk
            else:
                cur += chunk
        if cur:
            abstractiveSummary.append(cur)
            cnt += 1
        print(cnt)
        finalSummary = []
        cnt = 1
        startTime = time.perf_counter()
        for chunk in abstractiveSummary:
            print("Processing Chunk " + str(cnt))
            cnt += 1
            finalSummary.append(self.abstractiveService.generate_summary(chunk))
        endTime = time.perf_counter()
        print("Abstractive Summary Time " + str(endTime - startTime))
        end_total = time.perf_counter()
        print("Total Time " + str(end_total - start_total))
        return "\n".join(finalSummary)
