"use client";
import React from "react";
import Image from "next/image";
import FollowButton from "./FollowButton"; // Adjust path as needed
import { useSession } from "next-auth/react";

export default function ProfileHeader({
  profileUser, // user data object: { id, username, fullName, avatar, bio, followersCount, followingCount }
  onFollowToggle, // optional callback when follow status changes
  isFollowing, // boolean if current logged-in user follows this profileUser
}) {
  const { data: session } = useSession();
  const isOwnProfile = session?.user?.id === profileUser.id;

  return (
    <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8 p-6 bg-white border rounded shadow-sm max-w-4xl mx-auto">
      {/* Avatar */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden border border-gray-300">
        <Image
          src={profileUser.avatar || "/images/default-avatar.png"}
          alt={`${profileUser.username}'s avatar`}
          fill
          sizes="128px"
          className="object-cover"
          priority
        />
      </div>

      {/* User Info */}
      <div className="flex flex-col mt-4 md:mt-0 flex-1">
        {/* Username and action button */}
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold">{profileUser.username}</h2>

          {isOwnProfile ? (
            <button
              className="py-1 px-4 border border-gray-300 rounded text-sm font-semibold hover:bg-gray-100"
              // onClick={() => handle edit profile modal/page}
            >
              Edit Profile
            </button>
          ) : (
            <FollowButton
              isFollowing={isFollowing}
              userId={profileUser.id}
              onFollowToggle={onFollowToggle}
            />
          )}
        </div>

        {/* Full name */}
        <p className="text-gray-700 font-medium mt-1">{profileUser.fullName}</p>

        {/* Bio */}
        {profileUser.bio && (
          <p className="mt-2 text-gray-600 text-sm max-w-md">
            {profileUser.bio}
          </p>
        )}

        {/* Followers / Following */}
        <div className="flex space-x-6 mt-4 text-gray-600 font-medium text-sm">
          <div>
            <span className="font-semibold text-black">
              {profileUser.followersCount}
            </span>{" "}
            followers
          </div>
          <div>
            <span className="font-semibold text-black">
              {profileUser.followingCount}
            </span>{" "}
            following
          </div>
        </div>
      </div>
    </div>
  );
}
