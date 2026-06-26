let guidesData = [];
let cropsData = [];
let pestsData = [];


async function loadGuides() {

    try {

        const response = await fetch("data.json");
        const data = await response.json();

        guidesData = data.guides || [];
        cropsData = data.crops || [];
        pestsData = data.pests || []

        // Only run on guides page
        if (document.getElementById("guidesContainer")) {
            filterGuid();
        }

        // Only run on crops page
        if (document.getElementById("cropsContainer")) {
            filterCrops();
        }

        // only run on pets control page
        if (document.getElementById('pestsContainer')) {
            displayPests(pestsData)
        }

    } catch (error) {
        console.error("Error loading data:", error);
    }
}


// guid page related code .................

function filterGuid() {
    const filterCropType = document.getElementById('filterCropType').value  // organic
    const filterSeason = document.getElementById('filterSeason').value
    const filterMethod = document.getElementById('filterMethod').value



    const filterData = guidesData.filter((guide) => {
        // Check crop type
        if (filterCropType !== "all" && guide.category !== filterCropType) {
            return false;  // oi item bad jabe
        }
        // Check season
        if (filterSeason !== "all" && guide.season !== filterSeason) {
            return false;
        }
        // Check method
        if (filterMethod !== "all" && guide.method !== filterMethod) {
            return false;
        }
        return true;
    })


    displayGuides(filterData)
}



// Display guides
function displayGuides(data) {
    const guidesContainer = document.getElementById('guidesContainer');

    if (!data || data.length === 0) {
        guidesContainer.innerHTML = `<p class="text-2xl text-center lg:col-span-3">No data found</p>`;
        return;
    }

    const cardData = data.map((guide) => {
        return `
        <div class="card bg-base-100 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <figure class="px-4 pt-4">
                <img src="${guide.image || "https://placehold.co/400x200/15803d/white?text=Farming+Guide"}"
                    alt="${guide.name || guide.title}"
                    class="rounded-xl w-full h-48 object-cover">
            </figure>

            <div class="card-body">
                <h2 class="card-title text-xl font-bold text-green-800">
                    ${guide.title || guide.name}
                </h2>

                <div class="flex flex-wrap gap-1 mt-1">
                    <span class="badge badge-sm bg-green-100 text-green-700 border-none">
                        ${guide.category || guide.type}
                    </span>
                    <span class="badge badge-sm bg-amber-100 text-amber-700 border-none">
                        ${guide.season || "All"}
                    </span>
                    <span class="badge badge-sm bg-blue-100 text-blue-700 border-none">
                         ${guide.method || "Organic"}
                    </span>
                </div>

                <p class="text-gray-600 text-sm mt-2">
                    ${guide.summary || guide.symptoms || "No description available"}
                </p>

                ${guide.duration ? `<p class="text-xs text-gray-500">⏱ Duration: ${guide.duration}</p>` : ""}

               <!-- View Details Button -->
                    <div class="card-actions justify-end mt-3">
                    <button onclick='showGuidModal(${guide.id})' class="btn btn-sm btn-outline btn-success view-details">
                        <i class="fas fa-eye mr-1"></i> View Full Guide
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join("")



    guidesContainer.innerHTML = cardData;
}



//   // Show modal with full guide details
function showGuidModal(guideId) {

    const guide = guidesData.find((guid) => {
        if (guid.id === guideId) {
            return true
        }
    })


    const modal = document.createElement("div");
    modal.className =
        "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4";
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
          <div class="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h3 class="text-2xl font-bold text-green-800">${guide.title}</h3>
            <button class="btn btn-sm btn-circle btn-ghost close-modal">✕</button>
          </div>
          <div class="p-6">
            <img src="${guide.image || "https://placehold.co/600x300/15803d/white?text=Farming+Guide"}" alt="${guide.title}" class="w-full h-64 object-cover rounded-lg mb-4">

            <div class="flex flex-wrap gap-2 mb-4">
              <span class="badge bg-green-100 text-green-700 px-3 py-2"> ${guide.category}</span>
              <span class="badge bg-amber-100 text-amber-700 px-3 py-2"> ${guide.season}</span>
              <span class="badge bg-blue-100 text-blue-700 px-3 py-2"> ${guide.method}</span>
              ${guide.duration ? `<span class="badge bg-purple-100 text-purple-700 px-3 py-2"> ${guide.duration}</span>` : ""}
            </div>

            <p class="text-gray-700 mb-4">${guide.summary || "Complete guide for successful farming."}</p>

            <h4 class="font-bold text-lg mt-4 text-green-700"><i class="fas fa-list-ol mr-2"></i>Step-by-Step Instructions</h4>
            <ol class="list-decimal list-inside mt-2 space-y-2 bg-gray-50 p-4 rounded-lg">
              ${guide.steps && guide.steps.length > 0 ? guide.steps.map((step) => `<li class="text-gray-700">${step}</li>`).join("") : "<li>Step-by-step guide available on request</li>"}
            </ol>

            <h4 class="font-bold text-lg mt-4 text-yellow-600"><i class="fas fa-lightbulb mr-2"></i>Expert Tips</h4>
            <ul class="list-disc list-inside mt-2 space-y-2 bg-green-50 p-4 rounded-lg">
              ${guide.tips && guide.tips.length > 0 ? guide.tips.map((tip) => `<li class="text-gray-700">${tip}</li>`).join("") : "<li>Consult local agricultural extension office for personalized advice</li>"}
            </ul>

            <div class="mt-6 p-4 bg-blue-50 rounded-lg text-center">
              <p class="font-bold text-blue-700"><i class="fas fa-headset mr-2"></i>Need personalized guidance?</p>
              <a href="contact.html" class="btn btn-sm btn-primary mt-2">Contact an Agricultural Expert</a>
            </div>
          </div>
        </div>
      `;
    document.body.appendChild(modal);


    modal.querySelector(".close-modal").addEventListener("click", () => modal.remove());
}
// ................................................................

function filterCrops() {
    const cropCategoryFilter =
        document.getElementById("filterCropCategory").value;
    const filteredData = cropsData.filter((crop) => {
        // Check crop category (Grains, Fruits, Vegetables, Cash Crops)
        if (
            cropCategoryFilter !== "all" &&
            crop.category !== cropCategoryFilter
        ) {
            return false;
        }


        return true;
    });

    displayCrops(filteredData);
}


function displayCrops(data) {
    const cropsContainer = document.getElementById("cropsContainer");
    if (!data || data.length === 0) {
        cropsContainer.innerHTML = `<p class="text-2xl text-center lg:col-span-3">No data found</p>`;
        return;

    }
    const cardData = data
        .map((crop) => {
            return `
        <div class="card bg-base-100 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <figure class="px-4 pt-4">
            <img src="${crop.image || "https://placehold.co/400x200/15803d/white?text=" + encodeURIComponent(crop.name)}" 
              alt="${crop.name}" 
              class="rounded-xl w-full h-48 object-cover">
          </figure>
          <div class="card-body">
            <h2 class="card-title text-xl font-bold text-green-800">
              ${crop.name}
            </h2>

            <!-- Category Badge -->
            <div class="flex flex-wrap gap-1 mt-1">
              <span class="badge badge-sm bg-green-100 text-green-700 border-none">
                <i class="fas fa-tag mr-1"></i> ${crop.category}
              </span>
            </div>

            <!-- Quick Info -->
            <div class="mt-2 space-y-1 text-sm">
              <p class="text-gray-600"><strong>Varieties:</strong> ${crop.varieties}</p>
              <p class="text-gray-600"><strong>Soil:</strong> ${crop.soil || "Not specified"}</p>
              <p class="text-gray-600"><strong>Water:</strong> ${crop.water || "Not specified"}</p>
              <p class="text-gray-600"><strong>Growth:</strong> ${crop.growthDuration || "Not specified"}</p>
            </div>

            <!-- Nutritional Value Highlight -->
            ${crop.nutrition
                    ? `
              <div class="mt-2 p-2 bg-green-50 rounded-lg">
                <p class="font-semibold text-xs text-green-700"><i class="fas fa-chart-line mr-1"></i> Nutrition (per 100g):</p>
                <p class="text-xs text-gray-600">
                  ${crop.nutrition.calories ? ` ${crop.nutrition.calories} cal | ` : ""}
                  ${crop.nutrition.protein ? ` Protein: ${crop.nutrition.protein} | ` : ""}
                  ${crop.nutrition.carbs ? ` Carbs: ${crop.nutrition.carbs}` : ""}
                </p>
              </div>
            `
                    : ""
                }

            <!-- View Details Button -->
            <div class="card-actions justify-end mt-3">
              <button onclick='showCropModal(${crop.id})' class="btn btn-sm btn-outline btn-success view-details">
                <i class="fas fa-eye mr-1"></i> View Full Details
              </button>
            </div>
          </div>
        </div>
        `;
        })
        .join("");

    cropsContainer.innerHTML = cardData;
}

function showCropModal(cropId) {
    const crop = cropsData.find((c) => c.id === cropId);
    if (!crop) return;
    const usesArray = Array.isArray(crop.uses) ? crop.uses : [];
    const modal = document.createElement("div");
    modal.className =
        "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4";
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
          <div class="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h3 class="text-2xl font-bold text-green-800">${crop.name}</h3>
            <button class="btn btn-sm btn-circle btn-ghost close-modal">✕</button>
          </div>
          <div class="p-6">
            <img src="${crop.image || "https://placehold.co/600x300/15803d/white?text=" + encodeURIComponent(crop.name)}" 
              alt="${crop.name}" 
              class="w-full h-64 object-cover rounded-lg mb-4">

            <div class="flex flex-wrap gap-2 mb-4">
              <span class="badge bg-green-100 text-green-700 px-3 py-2 text-sm">
                <i class="fas fa-tag mr-1"></i> ${crop.category}
              </span>
            </div>

            <!-- Varieties -->
            <div class="mb-4">
              <h4 class="font-bold text-lg text-green-700"><i class="fas fa-list-ul mr-2"></i>Varieties</h4>
              <div class="flex flex-wrap gap-2 mt-2">
                ${crop.varieties}
              </div>
            </div>

            <!-- Soil & Water Requirements -->
            <div class="grid md:grid-cols-2 gap-4 mb-4">
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-bold text-amber-700"><i class="fas fa-mound mr-2"></i>Soil Requirements</p>
                <p class="text-gray-700 text-sm mt-1">${crop.soil || "Not specified"}</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-bold text-blue-700"><i class="fas fa-water mr-2"></i>Water Requirement</p>
                <p class="text-gray-700 text-sm mt-1">${crop.water || "Not specified"}</p>
              </div>
            </div>

            <!-- Harvesting Techniques -->
            <div class="mb-4 bg-green-50 p-3 rounded-lg">
              <h4 class="font-bold text-green-700"><i class="fas fa-cut mr-2"></i>Harvesting Techniques</h4>
              <p class="text-gray-700 text-sm mt-1">${crop.harvestTechnique || crop.harvest || "Harvest at optimal maturity for best quality and yield."}</p>
              <p class="text-gray-500 text-xs mt-1"><i class="fas fa-clock mr-1"></i> Growth Duration: ${crop.growthDuration || "Varies by variety"}</p>
            </div>

            <!-- Nutritional Values -->
            ${crop.nutrition
            ? `
              <div class="mb-4 bg-yellow-50 p-3 rounded-lg">
                <h4 class="font-bold text-yellow-700"><i class="fas fa-chart-line mr-2"></i>Nutritional Value (per 100g)</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-center">
                  ${crop.nutrition.calories ? `<div class="bg-white p-2 rounded"><p class="font-bold text-orange-600">${crop.nutrition.calories}</p><p class="text-xs text-gray-500">Calories</p></div>` : ""}
                  ${crop.nutrition.protein ? `<div class="bg-white p-2 rounded"><p class="font-bold text-green-600">${crop.nutrition.protein}</p><p class="text-xs text-gray-500">Protein</p></div>` : ""}
                  ${crop.nutrition.carbs ? `<div class="bg-white p-2 rounded"><p class="font-bold text-blue-600">${crop.nutrition.carbs}</p><p class="text-xs text-gray-500">Carbs</p></div>` : ""}
                  ${crop.nutrition.fiber ? `<div class="bg-white p-2 rounded"><p class="font-bold text-purple-600">${crop.nutrition.fiber}</p><p class="text-xs text-gray-500">Fiber</p></div>` : ""}
                </div>
              </div>
            `
            : ""
        }

            <!-- Potential Uses -->
            ${usesArray.length > 0
            ? `
              <div class="mb-4 bg-blue-50 p-3 rounded-lg">
                <h4 class="font-bold text-blue-700"><i class="fas fa-industry mr-2"></i>Potential Uses</h4>
                <div class="flex flex-wrap gap-2 mt-2">
                  ${usesArray.map((use) => `<span class="badge badge-md bg-white text-gray-700">${use}</span>`).join("")}
                </div>
              </div>
            `
            : ""
        }

            <!-- Tips -->
            ${crop.tips
            ? `
              <div class="mb-4 bg-green-50 p-3 rounded-lg">
                <h4 class="font-bold text-green-700"><i class="fas fa-lightbulb mr-2"></i>Expert Tip</h4>
                <p class="text-gray-700 text-sm">${crop.tips}</p>
              </div>
            `
            : ""
        }

            <div class="mt-6 p-4 bg-blue-50 rounded-lg text-center">
              <p class="font-bold text-blue-700"><i class="fas fa-headset mr-2"></i>Need more information about ${crop.name} cultivation?</p>
              <a href="contact.html" class="btn btn-sm btn-primary mt-2">Contact an Agricultural Expert</a>
            </div>
          </div>
        </div>
      `;
    document.body.appendChild(modal);
    modal
        .querySelector(".close-modal")
        .addEventListener("click", () => modal.remove());
}



// ................................................ pets control show

// Display pests as cards
function displayPests(data) {
    const pestsContainer = document.getElementById("pestsContainer");
    if (!data || data.length === 0) {
        pestsContainer.innerHTML = `<p class="text-2xl text-center lg:col-span-3">No data found</p>`;
        return;
    }
    const cardData = data
        .map((pest) => {
            // Get severity color
            let severityColor = "bg-gray-100 text-gray-700";
            if (pest.severity === "Low")
                severityColor = "bg-green-100 text-green-700";
            else if (pest.severity === "Medium")
                severityColor = "bg-yellow-100 text-yellow-700";
            else if (pest.severity === "High")
                severityColor = "bg-orange-100 text-orange-700";
            else if (pest.severity === "Critical")
                severityColor = "bg-red-100 text-red-700";


            // Affected crops
            const affectsArray = Array.isArray(pest.affects)
                ? pest.affects
                : [];

            // IPM strategies (preventive measures, biological controls, organic remedies)
            const ipmArray = Array.isArray(pest.ipm) ? pest.ipm : [];

            return `
        <div class="card bg-base-100 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <figure class="px-4 pt-4">
            <img src="${pest.image || "https://placehold.co/400x200/d97706/white?text=" + encodeURIComponent(pest.name)}" 
              alt="${pest.name}" 
              class="rounded-xl w-full h-48 object-cover">
          </figure>
          <div class="card-body">
            <div class="flex justify-between items-start">
              <h2 class="card-title text-xl font-bold text-amber-800">
                 ${pest.name}
              </h2>
              <span class="badge ${severityColor} px-3 py-2 text-xs font-semibold">
                ${pest.severity}
              </span>
            </div>

            <!-- Type Badge -->
            <div class="flex flex-wrap gap-1 mt-1">
              <span class="badge badge-sm bg-blue-100 text-blue-700 border-none">
                <i class="fas fa-tag mr-1"></i> ${pest.type}
              </span>
            </div>

            <!-- Affects -->
            <div class="mt-2">
              <p class="text-xs font-semibold text-gray-500"><i class="fas fa-tractor mr-1"></i> Affects:</p>
              <div class="flex flex-wrap gap-1 mt-1">
                ${affectsArray
                    .map(
                        (affect) =>
                            `<span class="badge badge-xs bg-gray-100 text-gray-600">${affect}</span>`,
                    )
                    .join("")}
                ${affectsArray.length > 3 ? `<span class="badge badge-xs bg-gray-100 text-gray-600">+${affectsArray.length - 3}</span>` : ""}
              </div>
            </div>

            <!-- Symptoms -->
            <p class="text-gray-600 text-sm mt-2">
              <i class="fas fa-stethoscope text-red-500 mr-1"></i> 
              <strong>Symptoms:</strong> ${pest.symptoms || "Not specified"}
            </p>

            <!-- Identification -->
            <p class="text-gray-600 text-sm">
              <i class="fas fa-search text-blue-500 mr-1"></i> 
              <strong>Identification:</strong> ${pest.identification || "Not specified"}
            </p>

            <!-- IPM Preview -->
            <div class="mt-2 p-2 bg-green-50 rounded-lg">
              <p class="font-semibold text-xs text-green-700"><i class="fas fa-leaf mr-1"></i> IPM Strategies:</p>
              <ul class="list-disc list-inside text-xs text-gray-600 ml-2">
                ${ipmArray
                    .map(
                        (strategy) =>
                            `<li>${strategy}</li>`,
                    )
                    .join("")}
              </ul>
            </div>
          </div>
        </div>
        `;
        })
        .join("");

    pestsContainer.innerHTML = cardData;
}


loadGuides()



// contrac form validation
const form = document.getElementById("contactForm");
const statusDiv = document.getElementById("status");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value.trim();

        // SIMPLE VALIDATION
        if (
            name === "" ||
            email === "" ||
            subject === "" ||
            message.length < 10
        ) {
            statusDiv.innerHTML = `
        <div class="bg-red-100 text-red-700 p-3 rounded-lg">
           Please fill all fields correctly (message min 10 chars)
        </div>
      `;
            return;
        }

        // SUCCESS MESSAGE
        statusDiv.innerHTML = `
      <div class="bg-green-100 text-green-700 p-3 rounded-lg">
         Message sent successfully! We will contact you soon.
      </div>
    `;

        form.reset();

        // auto hide after 3 sec
        setTimeout(() => {
            statusDiv.innerHTML = "";
        }, 3000);
    });

}

// .................................live date 



const date = new Date()
const dateContainer = document.getElementById('live-date')
dateContainer.innerHTML = date.getFullYear()


