export function createIceCorePaleoclimateDrill(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // 1. Bedrock
    const bedrockGeo = new THREE.CylinderGeometry(5, 5, 2, 32);
    const bedrockMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    const bedrock = new THREE.Mesh(bedrockGeo, bedrockMat);
    bedrock.position.set(0, -6, 0);
    group.add(bedrock);
    parts.push({ name: "Bedrock", description: "The solid rock layer beneath the ice sheet.", mesh: bedrock });

    // 2. Drill Rig
    const rigGeo = new THREE.CylinderGeometry(2.1, 2.1, 10, 32, 1, true);
    const rigMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });
    const rig = new THREE.Mesh(rigGeo, rigMat);
    rig.position.set(0, 0, 0);
    group.add(rig);
    parts.push({ name: "Drill Rig", description: "The primary cutting apparatus used to bore into the ice.", mesh: rig });

    // 3. Extracted Ice Core
    const coreGeo = new THREE.CylinderGeometry(1.8, 1.8, 8, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({ color: 0xe0f7fa, transparent: true, opacity: 0.6, transmission: 0.9, roughness: 0.1 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 0, 0);
    group.add(core);
    parts.push({ name: "Extracted Ice Core", description: "The cylindrical sample of ice retrieved for climate analysis.", mesh: core });

    // 4. Seasonal Bands
    const bandsGeo = new THREE.CylinderGeometry(1.82, 1.82, 7.8, 32, 16, true);
    const bandsMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, wireframe: true });
    const seasonalBands = new THREE.Mesh(bandsGeo, bandsMat);
    core.add(seasonalBands);
    parts.push({ name: "Seasonal Bands", description: "Visible layers representing annual snow accumulation.", mesh: seasonalBands });

    // 5. Volcanic Ash Layer
    const ashGeo = new THREE.CylinderGeometry(1.81, 1.81, 0.1, 32);
    const ashMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const ashLayer = new THREE.Mesh(ashGeo, ashMat);
    ashLayer.position.set(0, 1.5, 0);
    core.add(ashLayer);
    parts.push({ name: "Volcanic Ash Layer", description: "Tephra deposits used to precisely date the ice layer.", mesh: ashLayer });

    // 6. Dust Particle Layer
    const dustGeo = new THREE.CylinderGeometry(1.81, 1.81, 0.2, 32);
    const dustMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, transparent: true, opacity: 0.7 });
    const dustLayer = new THREE.Mesh(dustGeo, dustMat);
    dustLayer.position.set(0, -2, 0);
    core.add(dustLayer);
    parts.push({ name: "Dust Particle Layer", description: "Indicates periods of dry, windy climate in the past.", mesh: dustLayer });

    // 7. Trapped Air Bubbles
    const bubblesGroup = new THREE.Group();
    const bubbleGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for(let i = 0; i < 50; i++) {
        const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
        const yPos = (Math.random() - 0.5) * 7;
        const radius = Math.random() * 1.6;
        const angle = Math.random() * Math.PI * 2;
        bubble.position.set(
            Math.cos(angle) * radius,
            yPos,
            Math.sin(angle) * radius
        );
        bubblesGroup.add(bubble);
    }
    core.add(bubblesGroup);
    parts.push({ name: "Trapped Air Bubbles", description: "Tiny pockets of ancient atmosphere preserved in the ice.", mesh: bubblesGroup });

    // 8. Isotopic Analysis Laser
    const laserGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 16);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.rotation.z = Math.PI / 2;
    laser.position.set(2, 0, 0);
    group.add(laser);
    parts.push({ name: "Isotopic Analysis Laser", description: "Scans the core to measure oxygen and hydrogen isotopes.", mesh: laser });

    // 9. Meltwater Channel
    const channelGeo = new THREE.BoxGeometry(0.5, 10, 0.5);
    const channelMat = new THREE.MeshStandardMaterial({ color: 0x0055ff, transparent: true, opacity: 0.5 });
    const meltwater = new THREE.Mesh(channelGeo, channelMat);
    meltwater.position.set(-2.5, 0, 0);
    group.add(meltwater);
    parts.push({ name: "Meltwater Channel", description: "Drains thermal meltwater produced during the continuous drilling process.", mesh: meltwater });

    // 10. Depth Scale
    const scaleGeo = new THREE.BoxGeometry(0.2, 10, 0.2);
    const scaleMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const scale = new THREE.Mesh(scaleGeo, scaleMat);
    scale.position.set(2.5, 0, 0);
    group.add(scale);
    parts.push({ name: "Depth Scale", description: "Measures the extraction depth, correlating to the age of the ice.", mesh: scale });

    // Animation
    const animation = function(time) {
        // Drill rig rotating to simulate boring
        rig.rotation.y = time * 3;

        // Drill slowly moving up and down to represent drilling progress
        rig.position.y = Math.sin(time * 0.5) * 0.5;

        // Ice core slowly emerging and rotating slightly to reveal layers
        core.position.y = ((time * 0.5) % 10) * 0.5 - 2;
        core.rotation.y = time * 0.5;

        // Laser scanning up and down the core for continuous isotopic analysis
        laser.position.y = Math.sin(time * 2) * 3;
    };

    const quiz = [
        {
            question: "What do trapped air bubbles in ice cores primarily reveal to scientists?",
            options: ["Past oceanic currents", "Past atmospheric composition", "Historical tectonic plate movements", "Ancient solar flare frequency"],
            correctAnswer: 1
        },
        {
            question: "What does a distinct volcanic ash layer (tephra) in an ice core help scientists do?",
            options: ["Determine the ancient ocean temperature", "Date the ice layer precisely", "Identify ancient animal migrations", "Measure historical ozone levels"],
            correctAnswer: 1
        },
        {
            question: "Which stable isotopes are most commonly analyzed in ice cores to determine past temperatures?",
            options: ["Carbon-14 and Nitrogen-15", "Iron-56 and Nickel-59", "Oxygen-18 and Deuterium (Hydrogen-2)", "Uranium-235 and Lead-206"],
            correctAnswer: 2
        },
        {
            question: "What is the primary cause of the visible seasonal bands found in some ice cores?",
            options: ["Differences in summer and winter snow accumulation and physical properties", "Annual migration of microscopic algae", "Regular volcanic eruptions every year", "Human pollution variations between seasons"],
            correctAnswer: 0
        },
        {
            question: "Why are deep ice cores from Antarctica or Greenland crucial for paleoclimatology?",
            options: ["They are the only places with ice", "They provide continuous climate records stretching back hundreds of thousands of years", "The ice is easier to drill than anywhere else", "They contain frozen dinosaur DNA"],
            correctAnswer: 1
        },
        {
            question: "What can layers with high concentrations of dust particles in an ice core typically indicate about the historical climate?",
            options: ["Periods of increased global rainfall", "Periods of increased windiness and aridity (dryness)", "Periods of extreme volcanic inactivity", "Periods of unusually warm global temperatures"],
            correctAnswer: 1
        }
    ];

    return {
        model: group,
        parts: parts,
        animation: animation,
        quiz: quiz
    };
}
