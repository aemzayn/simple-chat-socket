import { Request, Response } from "express";
import Group from "../models/group";
import { makeSlug, randString } from "../utils/string-utils";

export const createGroup = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    const { name, isPrivate } = req.body;
    let { slug, inviteCode } = req.body;
    if (!slug) {
      slug = makeSlug(name);
    }

    if (!inviteCode) {
      inviteCode = randString(6);
    }

    const group = await Group.create({
      name,
      slug,
      isPrivate,
      inviteCode,
      createdBy: userId,
      users: [{ _id: userId }],
      admins: [{ _id: userId }],
    });

    return res.status(201).json({ group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyGroups = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const groups = await Group.find({ users: userId });

    return res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const joinGroup = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const { inviteCode } = req.body;
    const group = await Group.findOne({ inviteCode });
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.users.includes(userId)) {
      return res.status(400).json({ message: "User already in group" });
    }

    group.users.push(userId);

    await group.save();

    return res.status(200).json({ group });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const { groupId } = req.params;
    const group = await Group.findOne({ _id: groupId });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.admins.includes(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await group.deleteOne();

    return res.status(200).json({ message: "Group deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
