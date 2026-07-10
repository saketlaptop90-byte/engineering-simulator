export function createMagmaChamberSimulator(THREE) {
    const group = new THREE.Group();

    // 1. MagmaReservoir
    const reservoirGeometry = new THREE.SphereGeometry(5, 32, 32);
    const reservoirMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500, transparent: true, opacity: 0.8 });
    const reservoir = new THREE.Mesh(reservoirGeometry, reservoirMaterial);
    reservoir.name = 'MagmaReservoir';
    group.add(reservoir);

    // 2. CountryRock
    const rockGeometry = new THREE.BoxGeometry(15, 10, 15);
    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, wireframe: true });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.name = 'CountryRock';
    group.add(rock);

    // 3. FeederDike
    const dikeGeometry = new THREE.CylinderGeometry(1, 1, 10, 16);
    const dikeMaterial = new THREE.MeshStandardMaterial({ color: 0xcc2200 });
    const dike = new THREE.Mesh(dikeGeometry, dikeMaterial);
    dike.position.y = -8;
    dike.name = 'FeederDike';
    group.add(dike);

    // 4. CrystalMush
    const mushGeometry = new THREE.TorusGeometry(3, 1, 16, 32);
    const mushMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const mush = new THREE.Mesh(mushGeometry, mushMaterial);
    mush.rotation.x = Math.PI / 2;
    mush.position.y = -3;
    mush.name = 'CrystalMush';
    group.add(mush);

    // 5. ConvectionCurrents
    const currentsGeometry = new THREE.TorusKnotGeometry(2, 0.2, 64, 8);
    const currentsMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    const currents = new THREE.Mesh(currentsGeometry, currentsMaterial);
    currents.name = 'ConvectionCurrents';
    group.add(currents);

    // 6. VolatileBubbles
    const bubblesGroup = new THREE.Group();
    bubblesGroup.name = 'VolatileBubbles';
    const bubbleGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const bubbleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    for (let i = 0; i < 20; i++) {
        const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
        bubble.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6
        );
        bubble.userData.speed = Math.random() * 2 + 1;
        bubblesGroup.add(bubble);
    }
    group.add(bubblesGroup);

    // 7. AssimilatedXenoliths
    const xenolithGroup = new THREE.Group();
    xenolithGroup.name = 'AssimilatedXenoliths';
    const xenoGeo = new THREE.DodecahedronGeometry(0.5);
    const xenoMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    for (let i = 0; i < 5; i++) {
        const xeno = new THREE.Mesh(xenoGeo, xenoMat);
        xeno.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
        );
        xenolithGroup.add(xeno);
    }
    group.add(xenolithGroup);

    // 8. PressureSensor
    const sensorGeometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    sensor.position.set(4, 2, 0);
    sensor.name = 'PressureSensor';
    group.add(sensor);

    // 9. MagmaMixerZone
    const mixerGeometry = new THREE.CylinderGeometry(2, 2, 4, 16);
    const mixerMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347, wireframe: true });
    const mixer = new THREE.Mesh(mixerGeometry, mixerMaterial);
    mixer.name = 'MagmaMixerZone';
    group.add(mixer);

    // 10. RoofPendant
    const roofGeometry = new THREE.ConeGeometry(2, 4, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x696969 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 4, 0);
    roof.rotation.x = Math.PI;
    roof.name = 'RoofPendant';
    group.add(roof);

    // Animation
    let time = 0;
    group.userData.update = (deltaTime) => {
        time += deltaTime;
        
        // Rotate convection currents
        currents.rotation.x += deltaTime * 0.5;
        currents.rotation.y += deltaTime * 0.3;

        // Rotate mixer zone
        mixer.rotation.y -= deltaTime * 1.5;

        // Animate bubbles rising
        bubblesGroup.children.forEach(bubble => {
            bubble.position.y += deltaTime * bubble.userData.speed;
            if (bubble.position.y > 4) {
                bubble.position.y = -4;
            }
        });
        
        // Pulsate reservoir
        const scale = 1 + Math.sin(time * 2) * 0.02;
        reservoir.scale.set(scale, scale, scale);
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is a crystal mush in a magma chamber?",
            options: ["A zone of pure liquid magma", "A mixture of magma and mostly solid crystals", "A layer of completely solidified rock", "A gaseous pocket of volatiles"],
            correctAnswer: 1
        },
        {
            question: "What role does a feeder dike play?",
            options: ["It solidifies to form the chamber roof", "It acts as a conduit supplying magma from a deeper source", "It measures the pressure inside the chamber", "It filters out volatile bubbles"],
            correctAnswer: 1
        },
        {
            question: "What are xenoliths in the context of magma chambers?",
            options: ["Crystals that grow rapidly in the magma", "Bubbles of exsolved gas", "Fragments of country rock that have fallen into the magma", "Zones of intense convection"],
            correctAnswer: 2
        },
        {
            question: "Why do volatile bubbles rise in a magma chamber?",
            options: ["They are denser than the surrounding magma", "They are pushed by convection currents", "They are less dense than the surrounding magma and rise due to buoyancy", "They are pulled by the Earth's magnetic field"],
            correctAnswer: 2
        },
        {
            question: "What is a roof pendant?",
            options: ["A stalactite of magma", "A mass of country rock projecting downward into the magma chamber", "A vent through which magma erupts", "A crystal that floats to the top of the magma"],
            correctAnswer: 1
        },
        {
            question: "How do convection currents affect a magma chamber?",
            options: ["They promote mixing and heat transfer within the magma", "They cause the magma to instantly solidify", "They stop all crystal growth", "They are responsible for creating xenoliths"],
            correctAnswer: 0
        }
    ];

    return group;
}
