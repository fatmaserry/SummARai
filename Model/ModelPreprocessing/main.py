from fastapi import FastAPI, UploadFile

from OCRService import OCRService
from SummarizationPipeline import SummarizationService

app = FastAPI()
summarizationService = SummarizationService()



@app.post("/full-text")
async def get_full_text(file: UploadFile):
    ocr_service = OCRService()
    text = await ocr_service.process_pdf(file)
    return {"text": text}



from ChunkingService import ChunkingService
@app.post("/chunk-spacy")
async def get_chunk_sentences_spacy(file: UploadFile):
    ocr_service = OCRService()
    chunking = ChunkingService()
    text = await ocr_service.process_pdf(file)
    temp = await chunking.semantic_chunk_using_spacy(text)
    response = {}
    for i in range(len(temp)):
        response[i] = temp[i]
    return response



# @app.post("/overlappingChunking")
# async def getOverlappingChunks(file : UploadFile):
#     text = await ocr_service.process_pdf(file)
#     temp = await chunking.overlapping_chunking(text)
#     response = {}
#     for i in range(len(temp)):
#         response[i] = temp[i]
#     return response


@app.post("/getSummary")
async def getExtractiveSummary(file: UploadFile):
    ret = await summarizationService.run(file)
    return ret