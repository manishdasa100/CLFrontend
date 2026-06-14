import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import Icon from "./Icon";

const OUTPUT_SIZE = 400;

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

async function getCroppedFile(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, OUTPUT_SIZE, OUTPUT_SIZE
  );
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(new File([blob], "profile.jpg", { type: "image/jpeg" })),
      "image/jpeg",
      0.92
    );
  });
}

/* onConfirm(croppedFile, previewBlobUrl) */
export function ImageCropModal({ file, onConfirm, onCancel }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels || confirming) return;
    setConfirming(true);
    const croppedFile = await getCroppedFile(imageSrc, croppedAreaPixels);
    const previewUrl = URL.createObjectURL(croppedFile);
    onConfirm(croppedFile, previewUrl);
  };

  if (!imageSrc) return null;

  return (
    <div className="pf-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="pf-dialog pf-crop-dialog" role="dialog" aria-modal="true">
        <div className="pf-dialog-title">Crop photo</div>
        <div className="pf-dialog-body">Drag to reposition · scroll or use the slider to zoom</div>
        <div className="pf-crop-area">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            minZoom={1}
            maxZoom={4}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={false}
          />
        </div>
        <div className="pf-zoom-row">
          <Icon name="search" size={13} style={{ opacity: 0.45, flexShrink: 0 }} />
          <input
            type="range"
            className="pf-zoom-slider"
            min={1} max={4} step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <Icon name="search" size={18} style={{ opacity: 0.45, flexShrink: 0 }} />
        </div>
        <div className="pf-dialog-actions">
          <button className="cl-btn cl-btn-subtle" type="button" onClick={onCancel} disabled={confirming}>
            Cancel
          </button>
          <button className="cl-btn cl-btn-primary" type="button" onClick={handleConfirm} disabled={confirming}>
            {confirming ? "Processing…" : <><Icon name="check" size={14} /> Use photo</>}
          </button>
        </div>
      </div>
    </div>
  );
}
