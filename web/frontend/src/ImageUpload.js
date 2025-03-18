import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

function ImageUploadPage() {
    const { state } = useLocation();
    const history = useHistory();

    const [selectedImages, setSelectedImages] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const profile = state?.profile || {};
    const prompts = state?.prompts || "";

    const isMounted = useRef(true)

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false; // Cleanup function on unmount
        };
    }, []);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const validTypes = ["image/jpeg", "image/png"];

        const filteredFiles = files.filter(file => validTypes.includes(file.type));

        if (filteredFiles.length !== files.length) {
            setError("Only JPEG and PNG images are allowed.");
            return;
        }

        if (filteredFiles.length > 10) {
            setError("You can upload up to 10 images only.");
            return;
        }
        setSelectedImages(filteredFiles);
    };

    const handleSubmit = async () => {
        if (selectedImages.length < 2) {
            setError('Please upload at least 2-3 images');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append("profile", JSON.stringify(profile));
            selectedImages.forEach((image) => {
                formData.append("pictures", image);
            });

            const bestPictureResponse = await fetch('http://127.0.0.1:8000/best-picture', {
                method: 'POST',
                body: formData
            });

            const bestPictureData = await bestPictureResponse.json();

            if (!bestPictureResponse.ok) {
                if (isMounted.current) setError('Failed to analyze pictures.');
                return;
            }

            const bestPictureInfo = {
                rankingText: bestPictureData.picture_info,
                imageFiles: selectedImages.map((file) => ({
                    name: file.name,
                    type: file.type,
                    data: URL.createObjectURL(file),
                })),
            };
            if (isMounted.current) {
                history.push('/results', { 
                    profile, 
                    prompts, 
                    bestPicture: bestPictureInfo
                });
            }
        } catch (error) {
            if (isMounted.current) setError('An error occurred while processing images.');
            console.error('Error:', error);
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow-lg">
                <h1 className="text-center mb-4">Upload Your Best Photos</h1>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group>
                    <Form.Label><strong>Upload Images (2-10)</strong></Form.Label>
                    <Form.Control 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        disabled={isLoading}
                    />
                    <small className="text-muted">Upload at least 2-3 JPEG/PNG images, but no more than 10.</small>
                </Form.Group>

                {selectedImages.length > 0 && (
                    <div className="mt-3">
                        <h5>Selected Images:</h5>
                        <div className="d-flex flex-wrap gap-2">
                            {selectedImages.map((file, index) => (
                                <img 
                                    key={index} 
                                    src={URL.createObjectURL(file)} 
                                    alt={`Preview ${index + 1}`} 
                                    className="rounded" 
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }} 
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-center mt-4">
                    <Button 
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-100"
                    >
                        {isLoading ? "Processing..." : "Analyze Pictures"}
                    </Button>
                </div>
            </Card>
        </Container>
    );
}

export default ImageUploadPage;