const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");

/**
 * @route POST /posts
 * @description Create a new post
 * @body {title, address, acreage, length, width, direction, legal, status, type, description, images, legal_images, province, vip, price, isSoldOut, videoYoutube, videoFacebook, videoTiktok}
 * @access Login required
 */

router.post(
  "/",
  authentication.adminRequired,
  validators.validate([
    body("title", "Invalid title").exists().notEmpty(),
    body("address", "Invalid address").exists().notEmpty(),
    body("acreage", "Invalid acreage").exists().notEmpty(),
    body("length", "Invalid length").exists().notEmpty(),
    body("width", "Invalid width").exists().notEmpty(),
    body("legal", "Invalid legal").exists().notEmpty(),
    body("type", "Invalid type").exists().notEmpty(),
    body("description", "Invalid description").exists().notEmpty(),
    body("images", "Invalid images").exists().notEmpty(),
    body("province", "Invalid Province")
      .exists()
      .notEmpty()
      .isIn(["Kon Tum", "Gia Lai", "Đăk Lăk", "Đăk Nông", "Lâm Đồng"]),

    body("price", "Invalid price").exists().notEmpty().isString(),
    body("googleMapLocation", "Invalid Google Map Location")
      .exists()
      .notEmpty()
      .isString(),
  ]),
  postController.createNewPost
);

/**
 * @route GET /posts?page=1&limit=10$&query={value}
 * @description Get All Posts
 * @access Public
 */
router.get("/", postController.getAllPosts);

/**
 * @route GET /posts/province/:province
 * @description Get Filter Post By Province
 * @access Public
 */

router.get(
  "/province/:province",
  validators.validate([param("province").isString().exists()]),
  postController.getPostsFilterByProvince
);

/**
 * @route GET /posts/:postId
 * @description Get Single Post
 * @access Public
 */

router.get(
  "/:postId",
  validators.validate([
    param("postId").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getSinglePost
);

/**
 * @route PUT /posts/:postId
 * @description Update a Post
 * @body { title,
  address,
  acreage,
  length,
  width,
  legal,
  status,
  type,
  description,
  images,
  legal_images,
  province,
  direction,
  price,
  toilet,
  bedroom,
  videoYoutube,
  videoFacebook,
  videoTiktok,
  googleMapLocation,
  contact_name,
  contact_phoneNumber,}
 * @access Admin required
 */
router.put(
  "/:postId",
  authentication.adminRequired,
  validators.validate([
    param("postId").isString().custom(validators.checkObjectId),
  ]),
  postController.updateSinglePost
);

/**
 * @route DELETE /posts/:postId
 * @description Delete a Post
 * @access Admin required
 */
router.delete(
  "/:postId",
  authentication.adminRequired,
  validators.validate([
    param("postId").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.deleteSinglePost
);

/**
 * @route GET /posts/me/favoritePosts
 * @description Get favoritePost List
 * @access Login required
 */

router.get(
  "/:userId/favoritePosts",
  authentication.adminRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getFavoritePosts
);

module.exports = router;
