const express = require("express");
const {
  authenticateToken,
  authorizeRBACABAC,
  checkAttributeMatch,
} = require("../middleware/auth");
const { materials, getNextMaterialId } = require("../data/inMemoryData");

const materialsRouter = express.Router();
materialsRouter.use(authenticateToken);

materialsRouter.get("/", (req, res) => {
  let visibleMaterials;
  if (req.user.role === "admin") {
    visibleMaterials = materials;
  } else {
    visibleMaterials = materials.filter((m) =>
      checkAttributeMatch(m, "class_id", req.user.class_id)
    );
  }
  res.json(visibleMaterials);
});

materialsRouter.get("/:id", (req, res) => {
  const material = materials.find((m) => m.id === parseInt(req.params.id));
  if (!material) return res.status(404).json({ error: "Material not found" });
  const hasAccess =
    req.user.role === "admin" ||
    checkAttributeMatch(material, "class_id", req.user.class_id);
  if (!hasAccess)
    return res.status(403).json({ error: "Forbidden: Attribute mismatch" });
  res.json(material);
});

materialsRouter.post(
  "/",
  authorizeRBACABAC({
    roles: ["teacher", "admin"],
    abac: (req) =>
      req.user.role === "admin" ||
      checkAttributeMatch(
        { class_id: req.body.class_id },
        "class_id",
        req.user.class_id
      ),
  }),
  (req, res) => {
    const newMaterial = {
      id: getNextMaterialId(),
      owner_id: req.user.id,
      ...req.body,
    };
    materials.push(newMaterial);
    res.status(201).json(newMaterial);
  }
);

materialsRouter.put(
  "/:id",
  authorizeRBACABAC({
    roles: ["teacher", "admin"],
    abac: (req) => {
      const material = materials.find((m) => m.id === parseInt(req.params.id));
      if (!material) return false;
      return (
        req.user.role === "admin" ||
        (material.owner_id === req.user.id &&
          material.class_id === req.user.class_id)
      );
    },
  }),
  (req, res) => {
    const material = materials.find((m) => m.id === parseInt(req.params.id));
    if (!material) return res.status(404).json({ error: "Material not found" });
    Object.assign(material, req.body);
    res.json(material);
  }
);

materialsRouter.delete(
  "/:id",
  authorizeRBACABAC({
    roles: ["teacher", "admin"],
    abac: (req) => {
      const material = materials.find((m) => m.id === parseInt(req.params.id));
      if (!material) return false;
      return (
        req.user.role === "admin" ||
        (material.owner_id === req.user.id &&
          material.class_id === req.user.class_id)
      );
    },
  }),
  (req, res) => {
    const index = materials.findIndex((m) => m.id === parseInt(req.params.id));
    if (index === -1)
      return res.status(404).json({ error: "Material not found" });
    materials.splice(index, 1);
    res.json({ message: "Deleted" });
  }
);

module.exports = materialsRouter;
