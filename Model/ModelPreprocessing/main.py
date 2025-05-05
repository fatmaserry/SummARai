from fastapi import FastAPI, UploadFile
from mistralai import Mistral
import re
from pylatexenc.latex2text import LatexNodes2Text
from transformers import AutoTokenizer
import spacy

tokenizer = AutoTokenizer.from_pretrained("aubmindlab/bert-base-arabertv02")

API_KEY = '97jEatGBST7Sjlz1B2peJVvjstAvrlCW'
nlp = spacy.blank('ar')
nlp.add_pipe('sentencizer')

app = FastAPI()

# Tokenize and count tokens
def get_tokens(text):
  tokens = tokenizer(text, return_tensors="pt").input_ids
  token_count = tokens.shape[1]
  return token_count


class OCRService:
    def __init__(self, api_key):
        self.client = Mistral(api_key=api_key)

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
            },
            include_image_base64=True
        )
        ret = ""
        for page in ocr_response.pages:
            # Remove latex
            temp = LatexNodes2Text().latex_to_text(page.markdown)
            ret += self.clean_text(temp)

        return ret

    # Not efficient, chunks are split according to number of tokens without respect to ending of a sentence
    async def chunk_by_max_tokens(self, text: str, max_tokens=1024):
        words = text.split()
        chunks = []
        chunk = []
        token_count = 0
        for word in words:
            tokens = tokenizer.tokenize(word)
            if token_count + len(tokens) > max_tokens:
                chunks.append(' '.join(chunk))
                chunk = []
                token_count = 0
            chunk.append(word)
            token_count += len(tokens)
        if chunk:
            chunks.append(' '.join(chunk))
        return chunks

    # Very good, but not always efficient especially with dialogues
    async def chunk_by_sentences(self, text, max_sentences=5):
        sentences = re.split(r'(?<=[.؟!])\s+', text)
        return [' '.join(sentences[i:i + max_sentences]) for i in range(0, len(sentences), max_sentences)]


    # using spacy library
    async def chunk_using_spacy(self,text):
        doc = nlp(text)
        cur = ""
        ret = []
        tot = 0
        for sent in doc.sents:
            cur += sent.text
            s = get_tokens(cur)
            if s >= 800:
                tot += s
                ret.append(cur)
                cur = ""
        if cur != "":
            ret.append(cur)
            tot += get_tokens(cur)
        print(tot)
        return ret


ocr_service = OCRService(api_key=API_KEY)


@app.post("/full-text")
async def get_full_text(file: UploadFile):
    text = await ocr_service.process_pdf(file)
    return {"text": text}


@app.post("/chunk-tokens")
async def get_chunk_tokens(file: UploadFile):
    text = await ocr_service.process_pdf(file)
    temp = await ocr_service.chunk_by_max_tokens(text)
    return {
        "chunks": temp[0],
        "size": len(temp)
    }


@app.post("/chunk-sentences")
async def get_chunk_sentences(file: UploadFile):
    text = await ocr_service.process_pdf(file)
    temp = await ocr_service.chunk_by_sentences(text)
    return {
        "chunks": temp[3],
        "ch": temp[4],
        "c": temp[5],
        "size": len(temp)
    }



@app.post("/chunk-spacy")
async def get_chunk_sentences_spacy(text):
    # text = await ocr_service.process_pdf(file)
    temp = await ocr_service.chunk_using_spacy(text)
    return {
        "first": temp[0],
        "second": temp[1],
        "third": temp[2],
        # "fourth": temp[3],
        # "fifth": temp[4],
        # "sixth": temp[5],
        "f": get_tokens(temp[0]),
        "s": get_tokens(temp[1]),
        "t": get_tokens(temp[2]),
        # "frth": get_tokens(temp[3])
    }
