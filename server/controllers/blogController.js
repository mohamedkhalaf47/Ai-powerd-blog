import fs from "fs";
import imagekit from "../config/imageKit.js";
import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";
import main from "../config/geminiAi.js";

export const addBlog = async (req, res) => {
	try {
		const { title, subTitle, description, category, isPublished } = JSON.parse(
			req.body.blog
		);

		const imageFile = req.file;

		//checking all fields

		if (!title || !description || !category || !imageFile) {
			return res
				.status(400)
				.json({ success: false, message: "Missing Field(s)" });
		}

		const fileBuffer = fs.readFileSync(imageFile.path);

		//Upload Image to ImageKit
		const response = await imagekit.upload({
			file: fileBuffer,
			fileName: imageFile.originalname,
			folder: "/blogs_images",
		});

		// image optimization
		const optimizedImageUrl = imagekit.url({
			path: response.filePath,
			transformation: [
				{ quality: "auto" }, // auto compression
				{ format: "webp" }, // convert to modern format
				{ width: "1280" }, // width resizing
			],
		});
		const image = optimizedImageUrl;

		await Blog.create({
			title,
			subTitle,
			description,
			category,
			image,
			isPublished,
		});

		res.status(201).json({ success: true, message: "Blog Added Successfully" });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, message: error.message });
	}
};

export const getAllBlogs = async (req, res) => {
	try {
		const blogs = await Blog.find({ isPublished: true });
		res.status(200).json({ success: true, blogs });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const getBlogById = async (req, res) => {
	try {
		const { blogId } = req.params;
		const blog = await Blog.findById(blogId);
		if (!blog) {
			return res
				.status(404)
				.json({ success: false, message: "Blog Not Found" });
		}
		res.status(200).json({ success: true, blog });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const deleteBlogById = async (req, res) => {
	try {
		const { id } = req.body;
		await Blog.findByIdAndDelete(id);
		await Comment.deleteMany({ blog: id });
		res
			.status(204)
			.json({ success: true, message: "Blog Deleted Successfully" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const togglePublish = async (req, res) => {
	try {
		const { id } = req.body;
		const blog = await Blog.findById(id);
		blog.isPublished = !blog.isPublished;
		await blog.save();
		res.status(200).json({ success: true, message: "Blog Status Updated" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const addComment = async (req, res) => {
	try {
		const { blog, name, content } = req.body;
		await Comment.create({
			blog,
			name,
			content,
		});
		res
			.status(201)
			.json({ success: true, message: "Comment Added For Review" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const getBlogComment = async (req, res) => {
	try {
		const { blogId } = req.body;
		const comments = await Comment.find({
			blog: blogId,
			isApproved: true,
		}).sort({ createdAt: -1 });
		res.status(201).json({ success: true, comments });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const generateContent = async (req, res) => {
	try {
		const { prompt } = req.body;
		const content = await main(
			"Generate a Blog Content For This Topic in Simple Text Format For " + prompt
		);
		res.status(201).json({ success: true, content });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};
