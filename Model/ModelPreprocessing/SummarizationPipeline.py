from ChunkingService import ChunkingService
from ExtractiveService import ExtractiveService
from OCRService import OCRService
from fastapi import UploadFile

class SummarizationService:
    def __init__(self):
        self.ocr_service = OCRService()
        self.chunking_service = ChunkingService()
        self.extractiveService = ExtractiveService()




    async def run(self, file : UploadFile):
        fullText = await self.ocr_service.process_pdf(file)
        print("OCR Done")
        chunks = await self.chunking_service.chunk_using_spacy(fullText)
        print("Chunking Done")
        extractiveSummary = []
        for chunk in chunks:
            extractiveSummary.append(self.extractiveService.getSummary(chunk) + "\n")
        print("Extractive Summary Done")
        return extractiveSummary