import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { ibenModels } from "@/lib/models/ibendouma-models";

import { UAParser } from "ua-parser-js";

import { detectDeviceType } from "@/lib/utils";

export const options: NextAuthOptions = {
  pages: {
    signIn: "/signin",
    signOut: "/",
    newUser: "/signup",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req
      ) {
        const { UserIbenModel, VisitModel } = await ibenModels;

        if (credentials) {
          const isUserExist = await UserIbenModel.findOne({
            email: credentials.email,
          });
          if (!isUserExist) {
            throw new Error("Adresse E-mail incorrect");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            isUserExist.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Mot de passe incorrect");
          }
          if (isUserExist?.isBan) {
            throw new Error("Utilisateur banni");
          }

          const userAgent = req.headers && req.headers["user-agent"];

          const { os } = UAParser(userAgent);
          const deviceType = detectDeviceType(os.name || "");

          const isoDate = new Date().toISOString();
          const ip = req.headers && req.headers["x-forwarded-for"];

          await UserIbenModel.findByIdAndUpdate(
            isUserExist._id,
            {
              $set: {
                deviceUsed: deviceType,
                lastConnexion: isoDate,
                lastIpUsed: ip,
              },
            },
            {
              new: true,
              runValidators: true,
            }
          );

          await VisitModel.create({
            userId: isUserExist._id,
            ipAdress: ip,
          });

          return {
            id: isUserExist._id.toString(),
            email: isUserExist.email,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};
