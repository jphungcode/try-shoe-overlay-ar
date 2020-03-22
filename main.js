AFRAME.registerComponent("model", {
  init: function() {
    var element = document.querySelector("body");
    this.marker = document.querySelector("a-marker");
    var model = document.querySelector("#model-container");
    var hammertime = new Hammer(element);
    var pinch = new Hammer.Pinch(); // Pinch is not by default in the recognisers
    hammertime.add(pinch); // add it to the Manager instance

    hammertime.on("pan", ev => {
      let rotation = model.getAttribute("rotation");
      switch (ev.direction) {
        case 2:
          rotation.y = rotation.y + 5;
          break;
        case 4:
          rotation.y = rotation.y - 5;
          break;
        case 8:
          rotation.x = rotation.x + 5;
          break;
        case 16:
          rotation.x = rotation.x - 5;
          break;
        default:
          break;
      }
      model.setAttribute("rotation", rotation);
    });

    hammertime.on("pinch", ev => {
      let scale = { x: ev.scale, y: ev.scale, z: ev.scale };
      model.setAttribute("scale", scale);
    });

    // switch models
    let currentModel = 1;
    $("#left_btn").click(function() {
      document
        .querySelector(`#model-${currentModel}`)
        .setAttribute("data-active", "false");
      currentModel--;
      if (currentModel < 1) {
        currentModel = 2;
        $("#model-selector").attr("scale", "0.2 0.2 0.2");
        $("#model-selector").attr("gltf-model", `#model-${currentModel}`);
      } else {
        currentModel--;
        $("#model-selector").attr("scale", "0.5 0.5 0.5");
        $("#model-selector").attr("gltf-model", `#model-${currentModel}`);
      }
      document
        .querySelector(`#model-${currentModel}`)
        .setAttribute("data-active", "true");
    });

    $("#right_btn").click(function() {
      document
        .querySelector(`#model-${currentModel}`)
        .setAttribute("data-active", "false");
      currentModel++;
      if (currentModel > 2) {
        currentModel = 1;
        $("#model-selector").attr("scale", "0.5 0.5 0.5");
        $("#model-selector").attr("gltf-model", `#model-${currentModel}`);
      } else {
        $("#model-selector").attr("scale", "0.2 0.2 0.2");
        $("#model-selector").attr("gltf-model", `#model-${currentModel}`);
      }
      document
        .querySelector(`#model-${currentModel}`)
        .setAttribute("data-active", "true");
    });
  }
});

let modelActive = true;

AFRAME.registerComponent("loadscene", {
  init: function() {
    var sceneEl = document.querySelector("a-scene");
    sceneEl.addEventListener("loaded", function() {
      //remove loading gif
      document.querySelector("#spinner").style.display = "none";
    });
  },
  tick: function() {
    if (
      document.querySelector("#marker-hiro").object3D.visible == true &&
      modelActive == true
    ) {
      document.querySelector("#help_text").style.display = "block";
      document.querySelector("#toggleBtn").style.display = "flex";
    } else {
      document.querySelector("#help_text").style.display = "none";
      document.querySelector("#toggleBtn").style.display = "none";
    }
  }
});

// prevent body scrolling
document.addEventListener(
  "touchmove",
  function(e) {
    e.preventDefault();
  },
  { passive: false }
);

$(document).ready(function() {
  const swalWithBootstrapButtons = Swal.mixin({
    confirmButtonClass: "btn btn-success",
    cancelButtonClass: "btn btn-danger",
    buttonsStyling: "closeBtn",
    closeOnClickOutside: false,
    onOpen: function() {
      swal.disableConfirmButton();
    }
  });

  swal({
    title: "Shoe Swag",
    html:
      "By pressing Yes, you agree to the <a href='#'>Terms and Conditions</a> for this augmented reality experience.",
    confirmButtonText: "Yes I Agree",
    showCancelButton: true,
    reverseButtons: true
  }).then(result => {
    if (result.value) {
      $("#marker-hiro").css("display", "block");
    } else {
      $("#marker-hiro").css("display", "none");
      swalWithBootstrapButtons(
        "Cancelled",
        "Your augmented reality experience is disabled. Refresh your page and accept the Terms and Conditions to view the experience",
        "error"
      );
    }
  });

  document
    .getElementById("style_selection_container")
    .addEventListener("click", function(e) {
      let imageSelected = e.target.id;
      document.querySelectorAll("a-asset-item").forEach(asset => {
        if (asset.getAttribute("data-active") == "true") {
          let shoeType = asset.getAttribute("data-type");
          if (shoeType == "ultraboost") {
            document
              .querySelector(".shoe_overlay_image")
              .setAttribute(
                "src",
                `../image/catalog/AR/Adidas/${shoeType}/${imageSelected}.png`
              );
          } else {
            document
              .querySelector(".shoe_overlay_image")
              .setAttribute(
                "src",
                `../image/catalog/AR/Adidas/${shoeType}/${imageSelected}.png`
              );
          }
        }
      });
    });
});

function closePopUp() {
  let magnificPopup = $.magnificPopup.instance;
  // save instance in magnificPopup variable
  magnificPopup.close();
  // Close popup that is currently opened
}

$("#info_btn").click(function() {
  document.querySelectorAll("a-asset-item").forEach(asset => {
    if (asset.getAttribute("data-active") == "true") {
      let finalIndex = 0;
      let shoeType = asset.getAttribute("data-type");
      let styleContainer = document.querySelector("#style_selection_container");
      $("#style_selection_container").empty();
      if (shoeType == "ultraboost") {
        document
          .querySelector(".shoe_overlay_image")
          .setAttribute(
            "src",
            `../image/catalog/AR/Adidas/${shoeType}/top_view_4.png`
          );
        // set img src for style selection
        finalIndex = 5;
      } else {
        document
          .querySelector(".shoe_overlay_image")
          .setAttribute(
            "src",
            `../image/catalog/AR/Adidas/${shoeType}/style-1.png`
          );
        finalIndex = 4;
      }

      let finalHTML = "";
      for (i = 1; i < finalIndex; i++) {
        let imageHTML = `<img id="style-${i}" src="../image/catalog/AR/Adidas/${shoeType}/${shoeType}${i}_cropped.png "/>`;
        finalHTML = finalHTML + imageHTML;
      }
      styleContainer.innerHTML = finalHTML;
    }
  });
  $("#shoe_overlay").css("display", "block");
  $("#back_btn").css("display", "block");
  $("#help_text").css("display", "none");
  $("#left_btn").css("display", "none");
  $("#right_btn").css("display", "none");
  $("#style_selection").css("display", "block");
  $("#model-selector").attr("visible", "false");
  modelActive = false;
});

$("#back_btn").click(function() {
  $("#help_text").css("display", "block");
  $("#back_btn").css("display", "none");
  $("#shoe_overlay").css("display", "none");
  $("#left_btn").css("display", "block");
  $("#right_btn").css("display", "block");
  $("#style_selection").css("display", "none");
  $("#style_selection_container").css("display", "none");
  $("#black_overlay").css("display", "none");
  $("#model-selector").attr("visible", "true");
  modelActive = true;
});

let style_selection_display = false;

$("#style_selection").click(function() {
  if (!style_selection_display) {
    $("#style_selection_container").css("display", "inline-block");
    $("#black_overlay").css("display", "block");
    $("#logo").css("display", "none");
    style_selection_display = true;
  } else {
    $("#style_selection_container").css("display", "none");
    $("#black_overlay").css("display", "none");
    $("#logo").css("display", "block");
    style_selection_display = false;
  }
});
