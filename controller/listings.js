const listing = require("../models/listing");

module.exports.listings = async (req, res) => {
  let lists = await listing.find();
  res.render("listing/index.ejs", { lists, message: req.flash("message") });
};

module.exports.newListingForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.createListing = async (req, res) => {
  try {
   console.log(req.file);
    // const newListing = new listing({
    //   title : req.body.title,
    //   image: {
    //     url: req.body.image,
    //   },
    //   description : req.body.description,
    //   price : req.body.price,
    //   location: req.body.location,
    //   country : req.body.country,
    // });

    let { title, image, description, price, location, country } = req.body;   // simplified version of above code
   let filename = req.file.filename;
   let url = req.file.path;
  //  console.log(image);
   console.log(filename);
   console.log(url);
     const newListing = new listing({
      title,  
      image: { url , filename },
      description,
      price,
      location,
      country,
    });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("message","New list created");
    res.redirect("/listings");
  } catch (error) {
    res.render("listing/error.ejs", { error });
  }
}

module.exports.individualList = async (req, res) => {
  let { id } = req.params;
  let list = await listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
  res.render("listing/list.ejs", { list , message:req.flash("message") });
}

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  let list = await listing.findById(id);
  res.render("listing/edit.ejs", { list });
}

module.exports.update = async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body });
  res.redirect(`/listings/${id}`);
}

module.exports.destroy = async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  res.redirect("/listings");
}