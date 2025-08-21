"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import FollowButton from "./FollowButton";
import { useSession } from "next-auth/react";

export default function ProfileHeader({ username }) {
  const { data: session } = useSession();
  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) {
      console.warn("⚠️ No username provided to ProfileHeader");
      setLoading(false);
      return;
    }

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

  return (
    <div className="flex flex-col md:flex-row items-start md:space-x-10 p-6 max-w-4xl mx-auto">
      {/* Avatar */}
      <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
        <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border border-gray-300">
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
      <div className="flex-1 mt-6 md:mt-0 w-full">
        {/* Username + Button */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          <h2 className="text-2xl font-semibold">{profileUser.username}</h2>

          {isOwnProfile ? (
            <button className="px-4 py-1 border border-gray-300 rounded-md text-sm font-medium ">
              Edit profile
            </button>
          ) : (
            <FollowButton
              isFollowing={isFollowing}
              userId={profileUser.id}
              onFollowToggle={() => setIsFollowing(!isFollowing)}
            />
          )}
        </div>

        {/* Counts */}
        <div className="flex space-x-8 mt-4 text-sm">
          <div>
            <span className="font-semibold">{profileUser.postsCount || 0}</span>{" "}
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
          {profileUser.fullName && (
            <p className="font-semibold">{profileUser.fullName}</p>
          )}
          {profileUser.bio && (
            <p className="text-sm leading-snug">{profileUser.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
