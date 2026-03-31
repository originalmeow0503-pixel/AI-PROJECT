import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from model import get_model
import os

class DummyVirtualTryOnDataset(Dataset):
    """
    A placeholder dataset for Virtual Try-On.
    In reality, you would load image pairs: a person image and a garment image.
    """
    def __init__(self, size=100):
        self.size = size

    def __len__(self):
        return self.size

    def __getitem__(self, idx):
        # Return random noise as dummy data
        # H, W: 256, 192 (standard for VITON)
        person_img = torch.randn(3, 256, 192)
        garment_img = torch.randn(3, 256, 192)
        target_img = torch.randn(3, 256, 192) # The ground truth try-on image
        return person_img, garment_img, target_img

def train():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Training on device: {device}")
    
    # Init Model
    model = get_model().to(device)
    
    # Init Loss and Optimizer (L1 is standard for image generation)
    criterion = nn.L1Loss()
    optimizer = optim.Adam(model.parameters(), lr=0.0002, betas=(0.5, 0.999))
    
    # Load Data
    dataset = DummyVirtualTryOnDataset(size=100)
    dataloader = DataLoader(dataset, batch_size=4, shuffle=True)
    
    epochs = 10
    print("Starting Training Loop...")
    
    for epoch in range(epochs):
        running_loss = 0.0
        for i, (person_img, garment_img, target_img) in enumerate(dataloader):
            person_img, garment_img, target_img = person_img.to(device), garment_img.to(device), target_img.to(device)
            
            # Zero Gradients
            optimizer.zero_grad()
            
            # Forward Pass
            outputs = model(person_img, garment_img)
            
            # Compute Loss
            loss = criterion(outputs, target_img)
            
            # Backward and Optimize
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            
        print(f"Epoch [{epoch+1}/{epochs}], Loss: {running_loss/len(dataloader):.4f}")
        
    print("Training Finished!")
    # Save the model
    os.makedirs('checkpoints', exist_ok=True)
    torch.save(model.state_dict(), 'checkpoints/vton_model_latest.pth')
    print("Model saved to checkpoints/vton_model_latest.pth")

if __name__ == "__main__":
    train()
