import io
import os
import requests
import textwrap
import re
from fpdf import FPDF
from transformers import AutoTokenizer
from bidi.algorithm import get_display
import arabic_reshaper
from arabic_reshaper import ArabicReshaper, config_for_true_type_font, ENABLE_ALL_LIGATURES

class SmoothingService:
    def __init__(self):
        self.THETACLOUD_API_KEY = "r73t5e99f0bzhppajsc679d779uy3krmq4myxnbmtm6car9tqayg64kvimus3j64"
        self.API_URL = "https://ondemand.thetaedgecloud.com/infer_request/llama_3_1_70b/completions"
        self.MODEL_NAME = "meta-llama/Meta-Llama-3-70B-Instruct"
        self.FONT_PATH = "Fonts/Sahel_Regular.ttf"
        self.OUTPUT_PDF_PATH = "smoothed_output.pdf"
        self.MAX_TOKENS_PER_CHUNK = 700
        self.OVERLAP_SENTENCES = 1
        self.tokenizer = AutoTokenizer.from_pretrained("UBC-NLP/MARBERT")

    def smooth_text_with_thetacloud(self,user_prompt):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.THETACLOUD_API_KEY}"
        }

        payload = {
            "input": {
                "max_tokens": 2048,
                "stream": False,
                "temperature": 0.5,
                "top_p": 0.7,
                "messages": [
                    {
                        "role": "system",
                        "content": "أنت مساعد ذكي يُعيد صياغة النصوص العربية بلغة سهلة وسلسة."
                    },
                    {
                        "role": "user",
                        "content": (
                            "رجاءً أعد صياغة النص التالي بلغة عربية سهلة وسلسة، مع الحفاظ على تقسيمه إلى فقرات مفهومة.\n"
                            "كل فقرة يجب أن تحتوي على جمل مرتبطة بنفس السياق أو الموقف، وإذا تغير الموضوع، ابدأ فقرة جديدة.\n"
                            "افصل بين كل فقرتين بسطرين فارغين (\\n\\n) وليس فقط سطر واحد.\n"
                            "لا تدمج مواضيع مختلفة في نفس الفقرة.\n"
                            "حسّن الأسلوب ليكون أقرب إلى اللغة الأدبية، دون تغيير في المعنى أو ترتيب الأحداث.\n"
                            "اجعل النص أكثر وضوحًا، وسهولة في الفهم، وأفضل في الربط بين الجمل.\n\n"
                            "النص:\n\n"
                            f"{user_prompt}\n\n"
                            "النص المعاد صياغته:"
                        )
                    }

                ]
            }
        }

        response = requests.post(self.API_URL, headers=headers, json=payload)
        response.raise_for_status()

        data = response.json()

        try:
            return data["body"]["infer_requests"][0]["output"]["message"].strip()
        except (KeyError, IndexError) as e:
            raise ValueError(f" Unexpected response format:\n{data}") from e

    def save_to_pdf(self, text):
        output_path = self.OUTPUT_PDF_PATH
        pdf = FPDF()
        pdf.add_page()
        pdf.add_font("Sahel", "", self.FONT_PATH, uni=True)
        pdf.set_font("Sahel", size=12)

        for paragraph in text.split("\n\n"):
            lines = textwrap.wrap(paragraph.strip(), width=90)
            for line in lines:
                reshaped = arabic_reshaper.reshape(line)
                bidi_line = get_display(reshaped)
                pdf.multi_cell(0, 10, bidi_line, align='R')
            pdf.ln(5)

        # Get PDF content as a string, encode it, and write to BytesIO
        pdf_bytes = io.BytesIO()
        pdf_output = pdf.output(dest='S').encode('latin1')
        pdf_bytes.write(pdf_output)
        pdf_bytes.seek(0)
        # pdf_output.output(output_path)
        return pdf_bytes.read()

    def process_text_file(self, chunks):

        smoothed_chunks = []

        for i, chunk in enumerate(chunks):
            print(f" smoothing part {i + 1} of {len(chunks)} ...")
            smoothed = self.smooth_text_with_thetacloud(chunk)
            smoothed_chunks.append(smoothed)

        final_text = "\n\n".join(smoothed_chunks)
        return self.save_to_pdf(final_text)
