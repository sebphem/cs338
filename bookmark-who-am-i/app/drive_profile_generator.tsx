"use client";
import { useState } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaHeart, FaSignOutAlt, FaGoogle, FaRedo, FaMapMarkerAlt, FaInstagram, FaSpotify, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";

interface Profile {
  name: string;
  age: string;
  bio: string;
  interests: string[];
  lookingFor: string;
  textContent: string;
}

export default function DriveProfileGenerator() {
  const [processedResult, setProcessedResult] = useState<string | null>(null);
  const [randomImage, setRandomImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [currentTextContent, setCurrentTextContent] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const parseProfile = (text: string) => {
    const sections = ['Name:', 'Age:', 'Bio:', 'Interests:', 'Looking For:'];
    const result: Record<string, string> = {};
    
    let currentSection = '';
    let currentContent = [];
    
    const lines = text.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const section = sections.find(s => line.startsWith(s));
      if (section) {
        if (currentSection) {
          result[currentSection] = currentContent.join('\n');
          currentContent = [];
        }
        currentSection = section.replace(':', '').toLowerCase();
        currentContent.push(line.replace(section, '').trim());
      } else if (currentSection) {
        currentContent.push(line.trim());
      }
    }
    
    if (currentSection) {
      result[currentSection] = currentContent.join('\n');
    }
    
    return {
      name: result['name'] || '',
      age: result['age'] || '',
      bio: result['bio'] || '',
      interests: (result['interests'] || '').split(',').map(i => i.trim()),
      lookingFor: result['looking for'] || ''
    };
  };

  async function handleGenerateProfile() {
    setIsLoading(true);
    setProcessedResult(null);
    setRandomImage(null);
    setCurrentTextContent(null);

    try {
      if (status === "authenticated") {
        const response = await fetch("/api/drive");
        const data = await response.json();

        if (data.success) {
          setRandomImage(data.fileUrl);
          setCurrentTextContent(data.textContent);
          
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [
                {
                  role: "system",
                  content: `You are a master at creating dating profiles. Given this text content from a random file in the user's Google Drive, create an engaging and fun dating profile.
                  You must reference specific things from the text content that reflect their personality or interests.
                  Rules:
                  1. Be authentic - use real details from their content
                  2. Be creative and humorous
                  3. Keep it concise and engaging
                  4. Find unique angles in their content

                  Respond in the following format:
                  Name: [Create a creative 2-word name based on the content]

                  Age: [guess based on the content style and references, needs to be a number]

                  Bio: [Use interesting elements from their content, max 4 sentences]

                  Interests: [Extract genuine interests from the content, order in a list]

                  Looking For: [Create this based on the content's tone and subject matter]`
                },
                {
                  role: "user",
                  content: data.textContent
                }
              ]
            })
          });

          if (response.ok) {
            const result = await response.text();
            setProcessedResult(result);
          } else {
            throw new Error("Failed to generate profile");
          }
        } else {
          console.error("Failed to fetch content:", data.error);
        }
      }
    } catch (error) {
      console.error("Error generating profile:", error);
      setProcessedResult("Failed to generate profile from Drive content.");
    } finally {
      setIsLoading(false);
    }
  }

  const profile = processedResult ? parseProfile(processedResult) : null;

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!processedResult || !currentTextContent || !session?.user?.email) return;

    setSwipeDirection(direction);

    // Store the profile feedback
    const profile = parseProfile(processedResult);
    const profileData: Profile = {
      name: profile.name,
      age: profile.age,
      bio: profile.bio,
      interests: profile.interests,
      lookingFor: profile.lookingFor,
      textContent: currentTextContent
    };

    try {
      await fetch('/api/profile-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.email,
          profile: profileData,
          isLiked: direction === 'right'
        }),
      });
    } catch (error) {
      console.error('Error storing profile feedback:', error);
    }

    // Wait for animation to complete before generating new profile
    setTimeout(() => {
      setSwipeDirection(null);
      handleGenerateProfile();
    }, 500);
  };

  // Profile card variants for animation
  const variants = {
    center: { 
      x: 0, 
      y: 0,
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    left: { 
      x: '-250%',
      y: 200,
      opacity: 0, 
      scale: 0.5,
      rotate: -45,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        mass: 1.2,
        velocity: 2
      }
    },
    right: { 
      x: '250%',
      y: 200,
      opacity: 0, 
      scale: 0.5,
      rotate: 45,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        mass: 1.2,
        velocity: 2
      }
    },
    incoming: { 
      x: 0,
      y: 50,
      opacity: 0, 
      scale: 0.8,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Auth/Control Panel */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <FaHeart className="text-pink-500 animate-pulse" />
            DriveDate
          </h1>
          {status === "authenticated" ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-gray-800/50 px-4 py-2 rounded-full"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              <FaGoogle /> Sign in with Google
            </button>
          )}
        </div>

        {/* Main Content */}
        {status === "authenticated" ? (
          <>
            {/* Generate Button */}
            <button
              onClick={handleGenerateProfile}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-full mb-8 hover:opacity-90 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                "Generating..."
              ) : (
                <>
                  <FaRedo className="inline-block mr-2" /> Generate Random Profile
                </>
              )}
            </button>

            {/* Profile Card with Swipe Controls */}
            <div className="relative">
              {/* Left Button (Dislike) */}
              <button
                onClick={() => handleSwipe('left')}
                className="absolute left-[-6rem] top-1/2 transform -translate-y-1/2 z-20 group"
                disabled={isLoading}
              >
                <div className="relative p-6 rounded-full bg-gray-800/50 backdrop-blur transition-colors group-hover:bg-red-500/20 shadow-lg">
                  <div className="transform -scale-x-100">
                    <FaThumbsDown 
                      size={36} 
                      className="text-gray-400 group-hover:text-red-500 transition-colors drop-shadow-lg"
                    />
                  </div>
                </div>
              </button>

              {/* Right Button (Like) */}
              <button
                onClick={() => handleSwipe('right')}
                className="absolute right-[-6rem] top-1/2 transform -translate-y-1/2 z-20 group"
                disabled={isLoading}
              >
                <div className="relative p-6 rounded-full bg-gray-800/50 backdrop-blur transition-colors group-hover:bg-green-500/20 shadow-lg">
                  <FaThumbsUp 
                    size={36} 
                    className="text-gray-400 group-hover:text-green-500 transition-colors drop-shadow-lg"
                  />
                </div>
              </button>

              {/* Profile Card */}
              <AnimatePresence mode="wait">
                {(randomImage || profile) && (
                  <motion.div
                    key={randomImage} // Force re-render on image change
                    initial="incoming"
                    animate="center"
                    exit={swipeDirection ? swipeDirection : "incoming"}
                    variants={variants}
                    className="bg-gray-800/90 backdrop-blur rounded-3xl overflow-hidden shadow-2xl transform transition-all hover:scale-[1.02] relative"
                    style={{ transformOrigin: "center center" }}
                  >
                    {/* Swipe Overlay Indicators */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: swipeDirection === 'left' ? 1 : 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent z-20 pointer-events-none"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: swipeDirection === 'right' ? 1 : 0 }}
                      className="absolute inset-0 bg-gradient-to-l from-green-500/20 to-transparent z-20 pointer-events-none"
                    />

                    {/* Profile Image */}
                    {randomImage && (
                      <div className="relative w-full h-[28rem]">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-800/90 z-10" />
                        <Image
                          src={randomImage}
                          alt="Profile Picture"
                          layout="fill"
                          objectFit="cover"
                          className="brightness-95"
                          priority
                        />
                      </div>
                    )}

                    {/* Profile Info */}
                    {profile && (
                      <div className="p-6 space-y-6">
                        <div className="flex items-baseline gap-3">
                          <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
                          <span className="text-2xl text-gray-300">{profile.age}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-300">
                          <FaMapMarkerAlt className="text-pink-500" />
                          <span>Based on your Drive content</span>
                        </div>

                        <div className="space-y-6 text-gray-300">
                          <p className="text-lg leading-relaxed">{profile.bio}</p>

                          <div>
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <span className="text-pink-500">•</span> Interests
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {profile.interests.map((interest, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-700/50 backdrop-blur px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-600/50 transition-colors cursor-default"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <span className="text-pink-500">•</span> Looking For
                            </h3>
                            <p className="text-lg">{profile.lookingFor}</p>
                          </div>

                          <div className="pt-4 border-t border-gray-700">
                            <div className="flex gap-4">
                              <button className="text-gray-400 hover:text-pink-500 transition-colors">
                                <FaInstagram size={24} />
                              </button>
                              <button className="text-gray-400 hover:text-green-500 transition-colors">
                                <FaSpotify size={24} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-gray-800/30 backdrop-blur rounded-3xl p-8 shadow-xl">
            <FaHeart className="text-pink-500 text-5xl mx-auto mb-6 animate-pulse" />
            <p className="text-xl text-gray-300 mb-8">
              Sign in to discover your unique dating profile, magically generated from your Drive content!
            </p>
            <button
              onClick={() => signIn("google")}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 px-8 rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
            >
              <FaGoogle /> Get Started
            </button>
          </div>
        )}

        {isLoading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
            <p className="text-gray-400 mt-4 animate-pulse">Creating your perfect profile...</p>
          </div>
        )}
      </div>
    </div>
  );
} 