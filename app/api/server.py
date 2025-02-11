from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from pydantic import BaseModel
from AnalyzeProfile import AnalyzeProfile

class Message(BaseModel):
    content: str

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        print(f"New client {client_id} connected. Total clients: {len(self.active_connections)}")

    async def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            print(f"Client {client_id} disconnected. Remaining clients: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_clients: List[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    print(f"New client connected. Total clients: {len(connected_clients)}")
    
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received From Client: {data}")
            
            if data == "Analyzing...":
                try:
                    await websocket.send_text("Starting analysis...")
                    AnalyzeProfile()
                    await websocket.send_text("Analysis Complete")
                except Exception as e:
                    await websocket.send_text(f"Analysis failed: {str(e)}")

            
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
        print(f"Client disconnected. Remaining clients: {len(connected_clients)}")

@app.get("/send/{message}")
async def send_message(message: str):
    for client in connected_clients:
        await client.send_text(message)
        print(f"Server Broadcast: {message}")
    
    return {"status": "success", "message": "Message sent successfully"}

async def send_to_client(websocket: WebSocket, message: str):
    await websocket.send_text(f"Direct Message: {message}")


# cd E:\Project\insan-osint-saas\app\api; uvicorn server:app --host 0.0.0.0 --port 8000 --reload
