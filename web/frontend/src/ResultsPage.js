import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

function ResultsPage() {
    const location = useLocation();
    const rawPrompts = location.state?.prompts || "No prompts available";
    const bestPictureInfo = location.state?.bestPicture || { rankingText: "No picture information available.", imageFiles: [] };

    // ✅ Ensure Bold Formatting Works Even When the Prompt Structure Varies
    const formattedPrompts = rawPrompts
        ? rawPrompts.split("\n\n").map((prompt, index) => {
            // Find bold text and replace with HTML <strong>
            const formattedText = prompt.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return (
                <p key={index} dangerouslySetInnerHTML={{ __html: formattedText }} />
            );
        })
        : ["No prompts available"];

    // ✅ Extract Ranked Image Info
    const rankingText = bestPictureInfo.rankingText || "";
    const [imageRankingsText, extraImages] = rankingText.split(";EXTRAS-");

    const imageRankings = imageRankingsText
        ? imageRankingsText.split("\n").map(line => {
            const match = line.match(/^(\d+):\s*(\d+)\s*-\s*(.*)$/);
            if (match) {
                return {
                    rank: match[1],       // Rank number
                    imageIndex: match[2], // Image index
                    description: match[3] // Image explanation
                };
            }
            return null;
        }).filter(Boolean)
        : [];

    return (
        <Container className="mt-5">
            {/* Introduction Section */}
            <Card className="p-4 mb-4 shadow text-center">
                <h2 className="mb-3">❤️‍🔥 Your Ultimate Dating Profile ❤️‍🔥</h2>
                <p className="lead">
                    Crafted from your Reddit insights, interests, and best photos—this profile is <strong>designed to turn heads</strong> and spark real connections.  
                    Your unique energy, personality, and charm? All optimized to make swiping a no-brainer.  
                </p>
                <p className="text-muted">
                    💖 Get ready—your inbox might just overheat. 
                </p>
            </Card>

            {/* Prompts Section */}
            <Card className="p-3 mb-4 shadow">
                <h2>Prompts:</h2>
                {formattedPrompts}
            </Card>

            {/* Ranked Images Section */}
            <Card className="p-3 mb-4 shadow">
                <h2>Ranked Images:</h2>
                {imageRankings.length > 0 ? (
                    imageRankings.map(({ rank, imageIndex, description }, index) => (
                        <div key={index} className="mb-4">
                            <h5><strong>Rank {rank}:</strong></h5>
                            <p>{description}</p>
                            
                            {/* Ensure imageIndex is valid before rendering */}
                            {bestPictureInfo.imageFiles?.[imageIndex - 1]?.data && (
                                <img 
                                    src={bestPictureInfo.imageFiles[imageIndex - 1].data} 
                                    alt={`Ranked Image ${rank}`} 
                                    className="rounded mb-2"
                                    style={{ width: "100%", maxWidth: "400px", display: "block" }}
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <p>No ranked images available.</p>
                )}
            </Card>

            {/* Extra Photo Suggestions Section */}
            {extraImages && (
                <Card className="p-3 mb-4 shadow">
                    <h2>Additional Photo Suggestions:</h2>
                    <p style={{ whiteSpace: "pre-line" }}>{extraImages.trim()}</p>
                </Card>
            )}
        </Container>
    );
}

export default ResultsPage;


// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Container, Card } from 'react-bootstrap';

// function ResultsPage() {
//     const location = useLocation();
//     const rawPrompts = location.state?.prompts || "no prompts available";
//     // Initialize bestPictureInfo, fallback to sessionStorage if missing
//     const getStoredBestPictureInfo = () => {
//         try {
//             // Retrieve ranking text and image URLs separately
//             const storedInfo = JSON.parse(sessionStorage.getItem('bestPictureInfo')) || {};
//             return {
//                 rankingText: storedInfo.rankingText || "No picture information available.",
//                 imageFiles: storedInfo.imageFiles || [] // Retrieve image URLs
//             };
//         } catch (error) {
//             console.error("Error parsing bestPictureInfo from sessionStorage:", error);
//             return { rankingText: "No picture information available.", imageFiles: [] };
//         }
//     };
    
//     const [bestPictureInfo, setBestPictureInfo] = useState(() => {
//         return location.state?.bestPicture || getStoredBestPictureInfo();
//     });

//     // Retrieve image data if missing
//     useEffect(() => {
//         if (!bestPictureInfo.imageFiles.length) {
//             setBestPictureInfo(getStoredBestPictureInfo());
//         }
//     }, []);

//     const formattedPrompts = rawPrompts
//         ? rawPrompts.split("\n\n").map((prompt, index) => {
//             // Find bold text and replace with HTML <strong>
//             const formattedText = prompt.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
//             return (
//                 <p key={index} dangerouslySetInnerHTML={{ __html: formattedText }} />
//             );
//         })
//         : ["No prompts available"];

//     const rankingText = bestPictureInfo.rankingText || "";
//     const [imageRankingsText, extraImages] = rankingText.split(";EXTRAS-");

//     const imageRankings = imageRankingsText
//         ? imageRankingsText.split("\n").map(line => {
//             const match = line.match(/^(\d+):\s*(\d+)\s*-\s*(.*)$/);
//             if (match) {
//                 return {
//                     rank: match[1],       // Rank number
//                     imageIndex: match[2], // Image index
//                     description: match[3] // Image explanation
//                 };
//             }
//             return null;
//         }).filter(Boolean)
//         : [];

//     return (
//         <Container className="mt-5">
//             {/* Introduction Section */}
//             <Card className="p-4 mb-4 shadow text-center">
//                 <h2 className="mb-3">❤️‍🔥 Your Ultimate Dating Profile ❤️‍🔥</h2>
//                 <p className="lead">
//                     Crafted from your Reddit insights, interests, and best photos—this profile is <strong>designed to turn heads</strong> and spark real connections.  
//                     Your unique energy, personality, and charm? All optimized to make swiping a no-brainer.  
//                 </p>
//                 <p className="text-muted">
//                     💖 Get ready—your inbox might just overheat. 
//                 </p>
//             </Card>

//             {/* Prompts Section */}
//             <Card className="p-3 mb-4 shadow">
//                 <h2>Prompts:</h2>
//                 {formattedPrompts}
//             </Card>

//             {/* Ranked Images Section */}
//             <Card className="p-3 mb-4 shadow">
//                 <h2>Ranked Images:</h2>
//                 {imageRankings.length > 0 ? (
//                     imageRankings.map(({ rank, imageIndex, description }, index) => (
//                         <div key={index} className="mb-4">
//                             <h5><strong>Rank {rank}:</strong></h5>
//                             <p>{description}</p>
                            
//                             {/* Ensure imageIndex is valid before rendering */}
//                             {bestPictureInfo.imageFiles?.[imageIndex - 1] && (
//                                 <img 
//                                     src={bestPictureInfo.imageFiles[imageIndex - 1]}  // Use Base64 or URL directly
//                                     alt={`Ranked Image ${rank}`} 
//                                     className="rounded mb-2"
//                                     style={{ width: "100%", maxWidth: "400px", display: "block" }}
//                                 />
//                             )}

//                             {/* {bestPictureInfo.imageFiles[imageIndex - 1] && (
//                                 <img 
//                                     src={URL.createObjectURL(bestPictureInfo.imageFiles[imageIndex - 1])} 
//                                     alt={`Ranked Image ${rank}`} 
//                                     className="rounded mb-2"
//                                     style={{ width: "100%", maxWidth: "400px", display: "block" }}
//                                 />
//                             )} */}
//                         </div>
//                     ))
//                 ) : (
//                     <p>No ranked images available.</p>
//                 )}
//             </Card>

//             {/* Extra Photo Suggestions Section */}
//             {extraImages && (
//                 <Card className="p-3 mb-4 shadow">
//                     <h2>Additional Photo Suggestions:</h2>
//                     <p style={{ whiteSpace: "pre-line" }}>{extraImages.trim()}</p>
//                 </Card>
//             )}
//         </Container>
//     );
// }

// export default ResultsPage;
