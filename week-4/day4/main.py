from fastapi import FastAPI, WebSocket, WebSocketDisconnect ,HTTPException,UploadFile,File
from fastapi.staticfiles import StaticFiles
from PIL import Image
import os


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

# app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# Create folders automatically
os.makedirs("uploads", exist_ok=True)
os.makedirs("resized", exist_ok=True)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/resized", StaticFiles(directory="resized"), name="resized")


@app.get("/")
async def home():
    return {"message": "FastAPI File Upload Working"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(
            status_code=400,
            detail="Only JPG and PNG images allowed"
        )

    # Read file
    contents = await file.read()

    # Validate size (2MB)
    if len(contents) > 2 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 2MB"
        )

    # Save original image
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(contents)

    # Resize image using Pillow
    image = Image.open(file_path)

    image = image.resize((300, 300))

    resized_path = f"resized/{file.filename}"

    image.save(resized_path)

    return {
        "message": "Image uploaded and resized successfully",
        "original_image": f"http://127.0.0.1:8000/uploads/{file.filename}",
        "resized_image": f"http://127.0.0.1:8000/resized/{file.filename}"
    }


# Connection Manager
class ConnectionManager:

    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):

        await websocket.accept()

        self.active_connections.append(websocket)

        print("Client Connected")

    def disconnect(self, websocket: WebSocket):

        self.active_connections.remove(websocket)

        print("Client Disconnected")

    async def broadcast(self, message: str):

        for connection in self.active_connections:

            await connection.send_text(message)


manager = ConnectionManager()


# WebSocket Endpoint with Authentication
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    # Get token from query params
    token = websocket.query_params.get("token")

    # Validate token
    if token != "admin123":

        await websocket.close()

        print("Invalid Token")

        return

    # Connect client
    await manager.connect(websocket)

    try:

        while True:

            data = await websocket.receive_text()

            print("Received:", data)

            # Broadcast to all clients
            await manager.broadcast(f"Message: {data}")

    except WebSocketDisconnect:

        manager.disconnect(websocket)


# Product Creation API
@app.post("/create-product")
async def create_product(name: str):

    await manager.broadcast(f"🔥 New Product Added: {name}")

    return {"message": "Product Created"}

# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):

#     token = websocket.query_params.get("token")

#     if token != "admin123":
#         await websocket.close()
#         return

#     await manager.connect(websocket)

#     try:
#         while True:

#             data = await websocket.receive_text()

#             await manager.broadcast(data)

#     except:
#         manager.disconnect(websocket)