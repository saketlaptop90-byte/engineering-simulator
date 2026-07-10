export function createGreenhouseEffectSimulator(THREE) {
    const group = new THREE.Group();

    // Materials
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffee00 });
    const earthMat = new THREE.MeshPhongMaterial({ color: 0x2e8b57 });
    const atmosphereMat = new THREE.MeshPhongMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    const infraredMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });
    const gasMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const solarMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const reflectedMat = new THREE.MeshBasicMaterial({ color: 0xaaccff });
    const heatMat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.5 });
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const spaceMat = new THREE.MeshBasicMaterial({ color: 0x020205, side: THREE.BackSide });

    // 1. Sun
    const sunGeom = new THREE.SphereGeometry(3, 32, 32);
    const sun = new THREE.Mesh(sunGeom, sunMat);
    sun.position.set(-15, 12, -8);
    sun.userData.name = "Sun";
    group.add(sun);

    // 2. Earth Surface
    const earthGeom = new THREE.PlaneGeometry(30, 30);
    const earthSurface = new THREE.Mesh(earthGeom, earthMat);
    earthSurface.rotation.x = -Math.PI / 2;
    earthSurface.position.set(0, -3, 0);
    earthSurface.userData.name = "Earth Surface";
    group.add(earthSurface);

    // 3. Atmosphere Layer
    const atmosphereGeom = new THREE.PlaneGeometry(30, 30);
    const atmosphereLayer = new THREE.Mesh(atmosphereGeom, atmosphereMat);
    atmosphereLayer.rotation.x = -Math.PI / 2;
    atmosphereLayer.position.set(0, 5, 0);
    atmosphereLayer.userData.name = "Atmosphere Layer";
    group.add(atmosphereLayer);

    // 4. Infrared Radiation Waves (trapped)
    const irGroup = new THREE.Group();
    const irGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    for(let i=0; i<15; i++) {
        const irWave = new THREE.Mesh(irGeom, infraredMat);
        irWave.position.set(Math.random() * 20 - 10, Math.random() * 6 - 2, Math.random() * 20 - 10);
        irWave.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        irWave.userData.velocity = new THREE.Vector3((Math.random() - 0.5)*0.05, 0.05 + Math.random()*0.05, (Math.random() - 0.5)*0.05);
        irGroup.add(irWave);
    }
    irGroup.userData.name = "Infrared Radiation Waves";
    group.add(irGroup);

    // 5. Greenhouse Gas Molecules
    const gasGroup = new THREE.Group();
    const gasGeom = new THREE.SphereGeometry(0.3, 16, 16);
    for(let i=0; i<40; i++) {
        const gasMolecule = new THREE.Mesh(gasGeom, gasMat);
        gasMolecule.position.set(Math.random() * 26 - 13, 5 + (Math.random() - 0.5), Math.random() * 26 - 13);
        gasGroup.add(gasMolecule);
    }
    gasGroup.userData.name = "Greenhouse Gas Molecules";
    group.add(gasGroup);

    // 6. Solar Radiation Incoming
    const solarGroup = new THREE.Group();
    const solarGeom = new THREE.CylinderGeometry(0.08, 0.08, 3, 8);
    for(let i=0; i<8; i++) {
        const solarWave = new THREE.Mesh(solarGeom, solarMat);
        const startPos = new THREE.Vector3(-15 + Math.random()*5, 12 + Math.random()*5, -8 + Math.random()*5);
        const endPos = new THREE.Vector3(Math.random()*10 - 5, -3, Math.random()*10 - 5);
        solarWave.position.copy(startPos);
        solarWave.lookAt(endPos);
        solarWave.rotateX(Math.PI/2);
        
        const dir = new THREE.Vector3().subVectors(endPos, startPos).normalize();
        solarWave.userData.velocity = dir.multiplyScalar(0.2);
        solarWave.userData.startPos = startPos;
        solarGroup.add(solarWave);
    }
    solarGroup.userData.name = "Solar Radiation Incoming";
    group.add(solarGroup);

    // 7. Reflected Radiation
    const reflectGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const reflectWave = new THREE.Mesh(solarGeom, reflectedMat);
        const startPos = new THREE.Vector3(Math.random()*10 - 5, -3, Math.random()*10 - 5);
        const endPos = new THREE.Vector3(10 + Math.random()*10, 15 + Math.random()*5, 5 + Math.random()*10);
        reflectWave.position.copy(startPos);
        reflectWave.lookAt(endPos);
        reflectWave.rotateX(Math.PI/2);
        
        const dir = new THREE.Vector3().subVectors(endPos, startPos).normalize();
        reflectWave.userData.velocity = dir.multiplyScalar(0.15);
        reflectWave.userData.startPos = startPos;
        reflectGroup.add(reflectWave);
    }
    reflectGroup.userData.name = "Reflected Radiation";
    group.add(reflectGroup);

    // 8. Absorbed Heat
    const heatGeom = new THREE.BoxGeometry(28, 0.4, 28);
    const absorbedHeat = new THREE.Mesh(heatGeom, heatMat);
    absorbedHeat.position.set(0, -2.8, 0);
    absorbedHeat.userData.name = "Absorbed Heat";
    group.add(absorbedHeat);

    // 9. Clouds
    const cloudGroup = new THREE.Group();
    const cloudSphereGeom = new THREE.SphereGeometry(1.5, 16, 16);
    for(let i=0; i<8; i++) {
        const cloud = new THREE.Mesh(cloudSphereGeom, cloudMat);
        cloud.scale.set(2 + Math.random(), 1, 1.5 + Math.random());
        cloud.position.set(Math.random() * 20 - 10, 2 + Math.random(), Math.random() * 20 - 10);
        cloudGroup.add(cloud);
    }
    cloudGroup.userData.name = "Clouds";
    group.add(cloudGroup);

    // 10. Space Background
    const spaceGeom = new THREE.SphereGeometry(40, 32, 32);
    const spaceBg = new THREE.Mesh(spaceGeom, spaceMat);
    spaceBg.userData.name = "Space Background";
    group.add(spaceBg);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    group.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(-15, 12, -8);
    group.add(dirLight);

    // Animation function
    group.userData.animate = function(delta) {
        // Solar radiation falling towards earth
        solarGroup.children.forEach(wave => {
            wave.position.add(wave.userData.velocity);
            if (wave.position.y < -3) {
                wave.position.copy(wave.userData.startPos);
            }
        });

        // Reflected radiation moving to space
        reflectGroup.children.forEach(wave => {
            wave.position.add(wave.userData.velocity);
            if (wave.position.y > 15) {
                wave.position.copy(wave.userData.startPos);
            }
        });

        // Infrared bouncing between Earth (-3) and Atmosphere (5)
        irGroup.children.forEach(wave => {
            wave.position.add(wave.userData.velocity);
            if (wave.position.y > 4.5) {
                wave.userData.velocity.y *= -1;
                wave.position.y = 4.5;
            }
            if (wave.position.y < -2.5) {
                wave.userData.velocity.y *= -1;
                wave.position.y = -2.5;
            }
            if (wave.position.x > 14 || wave.position.x < -14) wave.userData.velocity.x *= -1;
            if (wave.position.z > 14 || wave.position.z < -14) wave.userData.velocity.z *= -1;
            
            // Align rotation with velocity
            wave.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), wave.userData.velocity.clone().normalize());
        });
        
        // Heat pulsating
        const time = Date.now() * 0.003;
        absorbedHeat.material.opacity = 0.4 + 0.1 * Math.sin(time);
        
        // Slowly move clouds
        cloudGroup.children.forEach(cloud => {
            cloud.position.x += 0.01;
            if (cloud.position.x > 15) cloud.position.x = -15;
        });
        
        // Slowly move gas molecules
        gasGroup.children.forEach((gas, index) => {
            gas.position.x += Math.sin(time + index) * 0.01;
            gas.position.z += Math.cos(time + index) * 0.01;
        });
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary source of energy that drives the greenhouse effect?",
            options: ["Geothermal energy", "Solar radiation", "Wind energy", "Nuclear power"],
            answer: 1
        },
        {
            question: "Which of the following is considered a major greenhouse gas?",
            options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
            answer: 2
        },
        {
            question: "What type of radiation gets trapped by greenhouse gases in the atmosphere?",
            options: ["Ultraviolet radiation", "Visible light", "Infrared radiation", "X-rays"],
            answer: 2
        },
        {
            question: "What happens to the majority of incoming solar radiation?",
            options: ["It is reflected by the atmosphere", "It is absorbed by the Earth's surface", "It escapes back into space immediately", "It creates clouds"],
            answer: 1
        },
        {
            question: "Which layer acts like a blanket, trapping heat and keeping the Earth warm?",
            options: ["The ozone layer", "The Earth's core", "The atmosphere containing greenhouse gases", "The ocean surface"],
            answer: 2
        },
        {
            question: "An increase in greenhouse gases leads to what phenomenon?",
            options: ["Global cooling", "Global warming", "More volcanic eruptions", "Increased solar radiation"],
            answer: 1
        }
    ];

    return group;
}
