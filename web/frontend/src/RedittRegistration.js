import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

function RedditProfilePage() {
    const [redditUsername, setRedditUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const history = useHistory();

    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleUsernameChange = (event) => {
        setRedditUsername(event.target.value);
    };

    const handleImageUpload = async (event) => {
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

        // Convert files to base64 strings
        const base64Images = await Promise.all(
            filteredFiles.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            })
        );

        setSelectedImages(base64Images);
    };

    const handleSubmit = async () => {
        if (!redditUsername) {
            setError('Please enter a Reddit username.');
            return;
        }

        if (selectedImages.length < 2) {
            setError('Please upload at least 2-3 images');
            return;
        }
        
        setIsLoading(true);
        setError('');

        try {
            // Step 1: Fetch Reddit Profile
            const profileResponse = await fetch('http://127.0.0.1:8000/redditprofilescrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: redditUsername })
            });

            const profileData = await profileResponse.json();
            console.log("Profile Data:", profileData);

            if (!profileResponse.ok || !profileData.response) {
                if (isMounted.current) setError('Failed to generate profile.');
                return;
            }

            const structuredProfile = {};
            profileData.response.split("\n").forEach(line => {
                const [key, value] = line.split(": ");
                if (key) structuredProfile[key.trim()] = value?.trim() || "";
            });

            setProfile(structuredProfile);

            // Step 2: Upload Images & Get Best Picture
            let bestPictureInfo = null;
            if (selectedImages.length > 0) {
                const formData = new FormData();
                formData.append("profile", JSON.stringify(structuredProfile));
                selectedImages.forEach((image, index) => {
                    // Convert base64 to blob for upload
                    const base64Data = image.split(',')[1];
                    const blob = base64ToBlob(base64Data, 'image/jpeg');
                    formData.append(`pictures`, blob);
                });

                const bestPictureResponse = await fetch('http://127.0.0.1:8000/best-picture', {
                    method: 'POST',
                    body: formData
                });

                const bestPictureData = await bestPictureResponse.json();
                console.log("Best Picture Response:", bestPictureData);

                if (bestPictureResponse.ok) {
                    bestPictureInfo = {
                        rankingText: bestPictureData.picture_info,
                        imageFiles: selectedImages // Store base64 images
                    };
                }
            }

            // Store bestPictureInfo in sessionStorage
            sessionStorage.setItem('bestPictureInfo', JSON.stringify({
                rankingText: bestPictureInfo.rankingText,
                imageFiles: selectedImages // Store base64 images
            }));
            
            // Redirect to Conversation Page with the profile
            if (isMounted.current) {
                history.push('/chat', { profile: structuredProfile });
            }

        } catch (error) {
            if (isMounted.current) setError('An error occurred while fetching the Reddit profile.');
            console.error('Error:', error);
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    };

    // Helper function to convert base64 to blob
    const base64ToBlob = (base64, type) => {
        const byteString = atob(base64);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type });
    };

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow-lg">
                <h1 className="text-center mb-4">Reddit Profile Scraper</h1>
                
                {/* Error Messages */}
                {error && <Alert variant="danger">{error}</Alert>}
                
                {/* Username Input */}
                <Form.Group>
                    <Form.Label><strong>Reddit Username</strong></Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="Enter your Reddit username"
                        value={redditUsername}
                        onChange={handleUsernameChange}
                        disabled={isLoading}
                    />
                </Form.Group>

                {/* Image Upload */}
                <Form.Group className="mt-3">
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

                {/* Preview Uploaded Images */}
                {selectedImages.length > 0 && (
                    <div className="mt-3">
                        <h5>Selected Images:</h5>
                        <div className="d-flex flex-wrap gap-2">
                            {selectedImages.map((image, index) => (
                                <img 
                                    key={index} 
                                    src={image} 
                                    alt={`Preview ${index + 1}`} 
                                    className="rounded" 
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }} 
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="text-center mt-4">
                    <Button 
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-100"
                    >
                        {isLoading ? "Processing..." : "Generate Profile"}
                    </Button>
                </div>
            </Card>
        </Container>
    );
}

export default RedditProfilePage;
