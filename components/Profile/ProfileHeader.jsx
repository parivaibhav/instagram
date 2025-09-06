"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import FollowButton from "./FollowButton";
import { useSession } from "next-auth/react";
import EditProfileModal from "./EditProfileModal";

export default function ProfileHeader({ username }) {
  const { data: session } = useSession();
  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch user data
  useEffect(() => {
    if (!username) return;

    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch(`/api/${username}`, { cache: "no-store" });
        if (!res.ok) throw new Error("User not found");

        const data = await res.json();
        setProfileUser(data);

        if (session?.user?.id && data.followers) {
          setIsFollowing(data.followers.includes(session.user.id));
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [username, session?.user?.id]);

  if (loading) return <div className="p-6 text-center">Loading profile...</div>;
  if (!profileUser)
    return <div className="p-6 text-center">User not found</div>;

  const isOwnProfile = session?.user?.id === profileUser.id;

  // Toggle follow state
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    setProfileUser((prev) => ({
      ...prev,
      followersCount: prev.followersCount + (isFollowing ? -1 : 1),
    }));
  };

  // Update profile data after editing
  const handleProfileUpdate = (updatedData) => {
    setProfileUser((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center md:items-start max-w-4xl mx-auto px-6 py-8">
        {/* Avatar */}
        <div className="flex-shrink-0 flex justify-center md:justify-start w-full md:w-auto">
          <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border">
            <Image
              src={profileUser.avatar || "/images/default-avatar.png"}
              alt={`${profileUser.username}'s avatar`}
              fill
              sizes="144px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 mt-6 md:mt-0 md:ml-16 w-full">
          {/* Username + Buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <h2 className="text-2xl text-center font-semibold">
              {profileUser.username}
            </h2>

            <div className="hidden md:block">
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="mt-2 md:mt-0 px-4 py-1 border rounded-md text-sm font-medium transition"
                >
                  Edit profile
                </button>
              ) : (
                <FollowButton
                  userId={profileUser.id}
                  isFollowing={isFollowing}
                  onFollowToggle={handleFollowToggle}
                />
              )}
            </div>
          </div>

          {/* Counts */}
          <div className="flex space-x-8 mt-4 justify-center md:justify-start text-sm md:text-base">
            <div>
              <span className="font-semibold">
                {profileUser.postsCount || 0}
              </span>{" "}
              posts
            </div>
            <div>
              <span className="font-semibold">
                {profileUser.followersCount || 0}
              </span>{" "}
              followers
            </div>
            <div>
              <span className="font-semibold">
                {profileUser.followingCount || 0}
              </span>{" "}
              following
            </div>
          </div>

          {/* Name + Bio */}
          <div className="mt-4">
            {profileUser.name && (
              <p className="font-semibold text-sm">{profileUser.name}</p>
            )}
            {profileUser.bio ? (
              <p className="text-sm leading-snug">{profileUser.bio}</p>
            ) : isOwnProfile ? (
              <p
                className="text-sm text-gray-400 cursor-pointer"
                onClick={() => setIsEditOpen(true)}
              >
                Add bio
              </p>
            ) : null}
          </div>

          {/* Mobile Button */}
          <div className="mt-4 md:hidden">
            {isOwnProfile ? (
              <button
                onClick={() => setIsEditOpen(true)}
                className="w-full px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 transition"
              >
                Edit profile
              </button>
            ) : (
              <FollowButton
                userId={profileUser.id}
                isFollowing={isFollowing}
                onFollowToggle={handleFollowToggle}
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={profileUser}
        onUpdate={handleProfileUpdate} // ✅ must match modal prop
      />
    </>
  );
}
