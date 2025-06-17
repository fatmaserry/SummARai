from mistralai import Mistral
from pylatexenc.latex2text import LatexNodes2Text
import re
from fastapi import UploadFile


class OCRService:
    def __init__(self):
        self.api_key = '97jEatGBST7Sjlz1B2peJVvjstAvrlCW'
        self.client = Mistral(api_key=self.api_key)

    def clean_text(self,text):
        # Remove Images tags
        text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
        # 1. Remove consecutive dots (2 or more)
        text = re.sub(r'\.{2,}', '', text)
        # 2. Remove # followed by digits
        text =re.sub(r'#\s*\d+', '', text)
        # 3. Remove -, *, ", «, or »
        text = re.sub(r'[-*"«»]', '', text)
        # 4. Replace each endline with a space
        text = re.sub(r'\n', ' ', text)
        return text

    async def process_pdf(self, file: UploadFile) -> str:
        uploaded_pdf = self.client.files.upload(
            file={
                "file_name": file.filename,
                "content": await file.read()
            },
            purpose="ocr"
        )
        self.client.files.retrieve(file_id=uploaded_pdf.id)
        signed_url = self.client.files.get_signed_url(file_id=uploaded_pdf.id)
        ocr_response = self.client.ocr.process(
            model="mistral-ocr-latest",
            document={
                "type": "document_url",
                "document_url": signed_url.url
            }
        )
        ret = ""
        for page in ocr_response.pages:
            # Remove latex
            temp = LatexNodes2Text().latex_to_text(page.markdown)
            ret += self.clean_text(temp)

        return ret