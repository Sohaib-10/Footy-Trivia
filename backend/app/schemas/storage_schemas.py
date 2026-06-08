from pydantic import BaseModel

class UploadResponse(BaseModel):
    public_url: str
