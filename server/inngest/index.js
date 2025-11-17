import {Inngest} from 'inngest';
import prisma from '../configs/prisma.js';

export const inngest = new Inngest({ id: "pm-beargoat" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      id: data.id,
      email: data.email_addresses[0]?.email_address || '',
      name: data.first_name + " " + data.last_name,
      image: data.profile_image_url
    })
  }
)
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.delete({
      where: {
        id: data.id,
      }
    })
  }
)
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
          email: data.email_addresses[0]?.email_address || '',
          name: data.first_name + " " + data.last_name,
          image: data.profile_image_url
      }
    })
  }
)





export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];