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
                // setError('Failed to generate profile.');
                // setIsLoading(false);
                // return;
            }

            const structuredProfile = {};
            profileData.response.split("\n").forEach(line => {
                const [key, value] = line.split(": ");
                if (key) structuredProfile[key.trim()] = value?.trim() || "";
            });

            setProfile(structuredProfile);

            // Step 2: Upload Images & Get Best Picture
            const imageUrls = selectedImages.map(file => URL.createObjectURL(file));

            let bestPictureInfo = null;
            if (selectedImages.length > 0) {
                const formData = new FormData();
                formData.append("profile", JSON.stringify(structuredProfile));
                selectedImages.forEach((image, index) => {
                    formData.append(`pictures`, image);
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
                        imageFiles: imageUrls
                        //imageFiles: selectedImages
                    };
                    console.log(imageUrls);
                }
            }

            // // Step 3: Fetch Generated Prompts
            // const promptsResponse = await fetch('http://127.0.0.1:8000/redditscrape', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ username: redditUsername })
            // });

            // const promptsData = await promptsResponse.json();
            // console.log("Generated Prompts:", promptsData);

            // if (!promptsResponse.ok) {
            //     if (isMounted.current) setError('Failed to generate prompts.');
            //     return;
            //     // setError('Failed to generate prompts.');
            //     // setIsLoading(false);
            //     // return;
            // }

            // // Step 4: Redirect to ResultsPage
            // if (isMounted.current) {
            //     history.push('/results', { 
            //         profile: structuredProfile, 
            //         prompts: promptsData.response, 
            //         bestPicture: bestPictureInfo
            //     });
            // }
            // **Store bestPictureInfo in localStorage (for later use in ResultsPage)**
            sessionStorage.setItem('bestPictureInfo', JSON.stringify({
                rankingText: bestPictureInfo.rankingText,
                imageFiles: imageUrls  // Store Image URLs properly
            }));
            
            // **Redirect to Conversation Page with ONLY the profile**
            if (isMounted.current) {
                history.push('/chat', { profile: structuredProfile });
            }

        } catch (error) {
            if (isMounted.current) setError('An error occurred while fetching the Reddit profile.');
            // setError('An error occurred while fetching the Reddit profile.');
            console.error('Error:', error);
        } finally {
            if (isMounted.current) setIsLoading(false);
            //setIsLoading(false);
        }
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
                        // autoFocus
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
