import {
  steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
  rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
  redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
  electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createSolarSystem(THREE) {
  const group = new THREE.Group();
  const parts = [];

  const planetsInfo = [
    { name: 'Sun', radius: 6.0, distance: 0, speed: 0.1, mat: tinted(yellowAccent, 0xffaa00), desc: 'Massive glowing sphere at center', orbit: false },
    { name: 'Mercury', radius: 0.38, distance: 10, speed: 4.14, mat: darkSteel, desc: 'Small grey, orbit ring', orbit: true },
    { name: 'Venus', radius: 0.95, distance: 14, speed: 1.62, mat: orangeAccent, desc: 'Orange/yellow, orbit ring', orbit: true },
    { name: 'Earth', radius: 1.0, distance: 19, speed: 1.0, mat: blueAccent, desc: 'Blue/green, orbit ring', orbit: true },
    { name: 'Mars', radius: 0.53, distance: 24, speed: 0.53, mat: redAccent, desc: 'Red, orbit ring', orbit: true },
    { name: 'Jupiter', radius: 3.5, distance: 34, speed: 0.084, mat: tinted(orangeAccent, 0xd0b090), desc: 'Massive striped gas giant, orbit ring', orbit: true },
    { name: 'Saturn', radius: 3.0, distance: 46, speed: 0.034, mat: tinted(yellowAccent, 0xe0d0a0), desc: 'Gas giant with prominent rings, orbit ring', orbit: true, hasRings: true },
    { name: 'Uranus', radius: 1.8, distance: 56, speed: 0.012, mat: tinted(blueAccent, 0x88ccff), desc: 'Light blue ice giant, orbit ring', orbit: true },
    { name: 'Neptune', radius: 1.7, distance: 65, speed: 0.006, mat: tinted(blueAccent, 0x2244bb), desc: 'Deep blue ice giant, orbit ring', orbit: true },
    { name: 'Asteroid Belt', radius: 0, distance: 29, speed: 0.3, mat: steel, desc: 'Cluster of tiny rocks between Mars and Jupiter', orbit: false, isAsteroidBelt: true }
  ];

  planetsInfo.forEach((info, index) => {
    const partGroup = new THREE.Group();
    
    if (info.orbit) {
      const orbitGeo = new THREE.TorusGeometry(info.distance, 0.05, 8, 128);
      const orbitMat = tinted(whitePlastic, 0x444444);
      const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
      orbitMesh.rotation.x = Math.PI / 2;
      partGroup.add(orbitMesh);
    }

    if (info.isAsteroidBelt) {
      const beltGroup = new THREE.Group();
      const rockGeo = new THREE.DodecahedronGeometry(0.2, 0);
      for(let i = 0; i < 400; i++) {
        const rock = new THREE.Mesh(rockGeo, info.mat);
        const angle = Math.random() * Math.PI * 2;
        const r = info.distance + (Math.random() - 0.5) * 4;
        const h = (Math.random() - 0.5) * 1.5;
        rock.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
        rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        const scale = 0.5 + Math.random() * 1.0;
        rock.scale.set(scale, scale, scale);
        beltGroup.add(rock);
      }
      partGroup.add(beltGroup);
    } else {
      const planetMesh = new THREE.Mesh(new THREE.SphereGeometry(info.radius, 32, 32), info.mat);
      planetMesh.position.set(info.distance, 0, 0);

      if (info.hasRings) {
        const ringGeo = new THREE.TorusGeometry(info.radius * 1.6, 0.3, 4, 64);
        const ringMat = tinted(yellowAccent, 0xcccccc);
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2 + 0.3;
        planetMesh.add(ringMesh);
      }

      // Make the Sun glow
      if (index === 0) {
        const sunMaterial = info.mat.clone();
        sunMaterial.emissive = new THREE.Color(0xffaa00);
        sunMaterial.emissiveIntensity = 0.8;
        planetMesh.material = sunMaterial;
      }

      partGroup.add(planetMesh);
    }

    group.add(partGroup);

    parts.push({
      name: info.name,
      description: info.desc,
      material: info.isAsteroidBelt ? 'Rocky debris' : 'Planetary matter',
      function: index === 0 ? 'Gravitational center of the solar system' : (info.isAsteroidBelt ? 'Rocky remnants from the early solar system' : 'Planetary body revolving around the Sun'),
      assemblyOrder: index + 1,
      connections: index === 0 ? [] : ['Sun'],
      failureEffect: index === 0 ? 'Extinction of all life, rogue planets' : 'Orbital perturbation, potential collisions',
      cascadeFailures: index === 0 ? ['Loss of light', 'Loss of heat', 'Orbital chaos'] : ['Gravitational shifts'],
      originalPosition: new THREE.Vector3(0, 0, 0),
      explodedPosition: new THREE.Vector3(0, index * 8, 0),
      group: partGroup
    });
  });

  const description = "A scale representation of the Solar System, including the central Sun, eight major planets with their orbits, and the asteroid belt.";

  const quizQuestions = [
    {
      question: "Which planet is the closest to the Sun?",
      options: ["Venus", "Mars", "Mercury", "Earth"],
      correctIndex: 2,
      explanation: "Mercury is the innermost planet of the Solar System, orbiting closest to the Sun.",
      difficulty: "easy"
    },
    {
      question: "Which of the following is considered a gas giant?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctIndex: 2,
      explanation: "Jupiter and Saturn are massive planets composed mainly of hydrogen and helium, known as gas giants.",
      difficulty: "easy"
    },
    {
      question: "Where is the main Asteroid Belt located?",
      options: ["Between Earth and Mars", "Between Mars and Jupiter", "Beyond Neptune", "Between Jupiter and Saturn"],
      correctIndex: 1,
      explanation: "The main asteroid belt orbits the Sun between the rocky planet Mars and the gas giant Jupiter.",
      difficulty: "medium"
    },
    {
      question: "Which planet is the largest in the Solar System?",
      options: ["Saturn", "Neptune", "Earth", "Jupiter"],
      correctIndex: 3,
      explanation: "Jupiter is by far the largest planet, with a mass more than two and a half times that of all the other planets combined.",
      difficulty: "easy"
    },
    {
      question: "What does an Astronomical Unit (AU) represent?",
      options: ["Distance from Earth to the Moon", "Distance from the Sun to Jupiter", "Average distance from Earth to the Sun", "Diameter of the Sun"],
      correctIndex: 2,
      explanation: "One AU is approximately 93 million miles (150 million km), which is the average distance from Earth to the Sun.",
      difficulty: "medium"
    },
    {
      question: "What are Saturn's rings primarily made of?",
      options: ["Solid bands of metal", "Liquid methane", "Chunks of ice and rock", "Pure hydrogen gas"],
      correctIndex: 2,
      explanation: "Saturn's rings consist of countless small particles, made almost entirely of water ice with a trace component of rocky material.",
      difficulty: "medium"
    }
  ];

  return {
    group,
    parts,
    description,
    quizQuestions,
    animate: function(time, speed, meshes) {
      const speeds = [0.1, 4.14, 1.62, 1.0, 0.53, 0.084, 0.034, 0.012, 0.006, 0.3];
      meshes.forEach((mesh, index) => {
        if (mesh.group) {
          // Revolve around the Sun
          mesh.group.rotation.y = time * speed * speeds[index] * 0.5;
          
          // Make the planet itself rotate on its axis (for visual effect)
          if (index > 0 && index < 9) {
            // Find the planet mesh (the last child in partGroup after the orbit ring)
            const planetMesh = mesh.group.children[mesh.group.children.length - 1];
            if (planetMesh) {
                planetMesh.rotation.y = time * speed * 2;
            }
          }
        }
      });
    }
  };
}

export const create = createSolarSystem;
