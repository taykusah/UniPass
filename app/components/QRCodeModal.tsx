'use client'

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Download } from 'lucide-react';
import { ExeatRequest } from '@/types/interfaces';

interface QRCodeModalProps {
  exeat: ExeatRequest;
}

const QRCodeModal = ({ exeat }: QRCodeModalProps) => {
  // Create QR code data object
  const qrData = {
    exeatId: exeat.id,
    studentId: exeat.studentId,
    studentName: exeat.studentName,
    matricNumber: exeat.matricNumber,
    departure: `${exeat.departureDate} ${exeat.departureTime}`,
    return: `${exeat.returnDate} ${exeat.returnTime}`,
    reason: exeat.reason,
    status: exeat.status
  };

  // Convert to string for QR code
  const qrString = JSON.stringify(qrData);

  // Function to download QR code as PNG
  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `exeat-qr-${exeat.id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <QrCode className="w-4 h-4" />
          View QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exeat Pass QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <Card className="p-4 bg-white">
            <CardContent className="flex flex-col items-center space-y-4">
              {/* QR Code */}
              <QRCodeSVG
                value={qrString}
                size={256}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: "/school-logo.png",
                  x: undefined,
                  y: undefined,
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
              
              {/* Exeat Details */}
              <div className="text-sm text-center space-y-1">
                <p className="font-semibold">{exeat.studentName}</p>
                <p className="text-gray-500">{exeat.matricNumber}</p>
                <p className="text-gray-500">Valid: {exeat.departureDate} - {exeat.returnDate}</p>
              </div>
            </CardContent>
          </Card>

          {/* Download Button */}
          <Button onClick={downloadQRCode} className="gap-2">
            <Download className="w-4 h-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;