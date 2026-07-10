export function createCoralReefEcosystem(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Materials
    const hardCoralMat = new THREE.MeshStandardMaterial({ color: 0xffa07a }); // Light Salmon
    const softCoralMat = new THREE.MeshStandardMaterial({ color: 0xff69b4 }); // Hot Pink
    const anemoneMat = new THREE.MeshStandardMaterial({ color: 0x9370db }); // Medium Purple
    const clownfishMat = new THREE.MeshStandardMaterial({ color: 0xff8c00 }); // Dark Orange
    const parrotfishMat = new THREE.MeshStandardMaterial({ color: 0x00ced1 }); // Dark Turquoise
    const sharkMat = new THREE.MeshStandardMaterial({ color: 0xa9a9a9 }); // Dark Gray
    const turtleMat = new THREE.MeshStandardMaterial({ color: 0x556b2f }); // Dark Olive Green
    const zooxanthellaeMat = new THREE.MeshStandardMaterial({ color: 0x98fb98 }); // Pale Green
    const spongeMat = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Yellow
    const crustaceanMat = new THREE.MeshStandardMaterial({ color: 0xdc143c }); // Crimson

    // 1. Hard Coral
    const hardCoralGeom = new THREE.DodecahedronGeometry(2);
    const hardCoral = new THREE.Mesh(hardCoralGeom, hardCoralMat);
    hardCoral.position.set(-5, -2, -2);
    group.add(hardCoral);
    parts.push({
        mesh: hardCoral,
        name: "Hard Coral",
        description: "The primary reef-building corals that produce a rigid calcium carbonate skeleton."
    });

    // 2. Soft Coral
    const softCoralGeom = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    const softCoral = new THREE.Mesh(softCoralGeom, softCoralMat);
    softCoral.position.set(5, -1, -3);
    group.add(softCoral);
    parts.push({
        mesh: softCoral,
        name: "Soft Coral",
        description: "Flexible corals that lack a solid calcium carbonate skeleton, swaying with the currents."
    });

    // 3. Anemone
    const anemoneGeom = new THREE.SphereGeometry(1.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const anemone = new THREE.Mesh(anemoneGeom, anemoneMat);
    anemone.position.set(0, -3, 3);
    group.add(anemone);
    parts.push({
        mesh: anemone,
        name: "Anemone",
        description: "Predatory marine invertebrates that have a symbiotic relationship with clownfish."
    });

    // 4. Clownfish
    const clownfishGeom = new THREE.ConeGeometry(0.3, 1, 8);
    const clownfish = new THREE.Mesh(clownfishGeom, clownfishMat);
    clownfish.rotation.z = Math.PI / 2;
    clownfish.position.set(0, -2, 3);
    group.add(clownfish);
    parts.push({
        mesh: clownfish,
        name: "Clownfish",
        description: "Small, colorful fish that live among the tentacles of sea anemones."
    });

    // 5. Parrotfish
    const parrotfishGeom = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const parrotfish = new THREE.Mesh(parrotfishGeom, parrotfishMat);
    parrotfish.rotation.z = Math.PI / 2;
    parrotfish.position.set(-4, 1, 0);
    group.add(parrotfish);
    parts.push({
        mesh: parrotfish,
        name: "Parrotfish",
        description: "Herbivorous fish that eat algae from coral, contributing to the bioerosion of the reef."
    });

    // 6. Reef Shark
    const sharkGeom = new THREE.ConeGeometry(0.8, 3, 16);
    const shark = new THREE.Mesh(sharkGeom, sharkMat);
    shark.rotation.z = -Math.PI / 2;
    shark.position.set(6, 4, -4);
    group.add(shark);
    parts.push({
        mesh: shark,
        name: "Reef Shark",
        description: "Apex predators that help regulate the population of smaller fishes, maintaining reef health."
    });

    // 7. Sea Turtle
    const turtleGeom = new THREE.BoxGeometry(2, 0.5, 1.5);
    const turtle = new THREE.Mesh(turtleGeom, turtleMat);
    turtle.position.set(3, 2, 4);
    group.add(turtle);
    parts.push({
        mesh: turtle,
        name: "Sea Turtle",
        description: "Marine reptiles that graze on sea grass and sponges, aiding the reef ecosystem."
    });

    // 8. Zooxanthellae
    const zooGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const zooxanthellae = new THREE.Mesh(zooGeom, zooxanthellaeMat);
    zooxanthellae.position.set(-4.5, -0.5, -1.5);
    group.add(zooxanthellae);
    parts.push({
        mesh: zooxanthellae,
        name: "Zooxanthellae",
        description: "Photosynthetic algae that live inside coral tissues, providing them with essential nutrients."
    });

    // 9. Sponge
    const spongeGeom = new THREE.TorusGeometry(1, 0.4, 8, 16);
    const sponge = new THREE.Mesh(spongeGeom, spongeMat);
    sponge.position.set(-2, -2, -5);
    group.add(sponge);
    parts.push({
        mesh: sponge,
        name: "Sponge",
        description: "Filter-feeding organisms that pump water through their bodies to extract nutrients."
    });

    // 10. Crustacean
    const crustaceanGeom = new THREE.TetrahedronGeometry(0.5);
    const crustacean = new THREE.Mesh(crustaceanGeom, crustaceanMat);
    crustacean.position.set(2, -3, -1);
    group.add(crustacean);
    parts.push({
        mesh: crustacean,
        name: "Crustacean",
        description: "Includes crabs and shrimp; many act as cleaners for fish or scavengers on the reef."
    });

    // Animation function
    let time = 0;
    const animation = function() {
        time += 0.02;

        // Animate Clownfish circling the anemone
        clownfish.position.x = 0 + Math.cos(time * 2) * 1.5;
        clownfish.position.z = 3 + Math.sin(time * 2) * 1.5;
        clownfish.rotation.y = -time * 2;

        // Animate Parrotfish swimming back and forth
        parrotfish.position.x = -4 + Math.sin(time) * 2;
        
        // Animate Reef Shark patrolling
        shark.position.x = 6 + Math.cos(time * 0.5) * 4;
        shark.position.z = -4 + Math.sin(time * 0.5) * 4;
        shark.rotation.y = -time * 0.5;

        // Animate Turtle slowly swimming up and down
        turtle.position.y = 2 + Math.sin(time * 0.3) * 1;
        
        // Soft coral swaying
        softCoral.rotation.z = Math.sin(time) * 0.1;
    };

    const questions = [
        {
            question: "What type of coral forms the solid structure of the reef?",
            options: ["Soft Coral", "Hard Coral", "Fire Coral", "Deep Sea Coral"],
            correctAnswer: 1,
            explanation: "Hard corals produce a calcium carbonate skeleton that builds the foundation of the reef."
        },
        {
            question: "Which organism has a mutually beneficial relationship with the sea anemone?",
            options: ["Parrotfish", "Reef Shark", "Clownfish", "Sponge"],
            correctAnswer: 2,
            explanation: "Clownfish live among the anemone's tentacles, gaining protection while cleaning the anemone and providing nutrients."
        },
        {
            question: "What are the photosynthetic algae living inside coral tissues called?",
            options: ["Cyanobacteria", "Zooplankton", "Phytoplankton", "Zooxanthellae"],
            correctAnswer: 3,
            explanation: "Zooxanthellae live symbiotically within coral tissues, providing them with food via photosynthesis."
        },
        {
            question: "How do parrotfish contribute to the reef ecosystem?",
            options: ["They prey on sharks", "They eat algae off corals, creating sand", "They build the coral skeletons", "They filter the water"],
            correctAnswer: 1,
            explanation: "Parrotfish scrape algae from corals with their beak-like teeth, and excrete fine white sand."
        },
        {
            question: "Why are sponges important to a coral reef?",
            options: ["They provide shade for fish", "They filter large volumes of water, recycling nutrients", "They attack predators", "They produce calcium carbonate"],
            correctAnswer: 1,
            explanation: "Sponges are filter feeders that pump water through their bodies, cleaning it and cycling nutrients."
        },
        {
            question: "What role do reef sharks play in the ecosystem?",
            options: ["Primary producers", "Decomposers", "Apex predators", "Filter feeders"],
            correctAnswer: 2,
            explanation: "As apex predators, reef sharks help keep populations of smaller fish in check, maintaining the reef's balance."
        }
    ];

    return {
        group,
        parts,
        animation,
        questions
    };
}
