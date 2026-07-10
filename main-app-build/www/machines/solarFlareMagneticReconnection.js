export function createSolarFlareMagneticReconnection(THREE) {
    const group = new THREE.Group();

    // 1. solar photosphere
    const photosphereGeo = new THREE.SphereGeometry(20, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    const photosphereMat = new THREE.MeshStandardMaterial({ 
        color: 0xffaa00, 
        emissive: 0x442200, 
        roughness: 0.8 
    });
    const photosphere = new THREE.Mesh(photosphereGeo, photosphereMat);
    photosphere.position.y = -20;
    group.add(photosphere);

    // 2. chromosphere
    const chromoGeo = new THREE.SphereGeometry(20.2, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    const chromoMat = new THREE.MeshStandardMaterial({ 
        color: 0xff3300, 
        transparent: true, 
        opacity: 0.4, 
        emissive: 0xaa0000, 
        emissiveIntensity: 0.5,
        blending: THREE.AdditiveBlending
    });
    const chromosphere = new THREE.Mesh(chromoGeo, chromoMat);
    chromosphere.position.y = -20;
    group.add(chromosphere);

    // 3. sunspot pair
    const sunspotPair = new THREE.Group();
    const spotGeo = new THREE.CircleGeometry(1.5, 32);
    const spotMat = new THREE.MeshBasicMaterial({ color: 0x050000 });
    const spot1 = new THREE.Mesh(spotGeo, spotMat);
    spot1.rotation.x = -Math.PI / 2;
    spot1.position.set(-5, 0.25, 0);
    const spot2 = new THREE.Mesh(spotGeo, spotMat);
    spot2.rotation.x = -Math.PI / 2;
    spot2.position.set(5, 0.25, 0);
    sunspotPair.add(spot1, spot2);
    group.add(sunspotPair);

    // 4. primary magnetic flux tube
    const primaryGeo = new THREE.TorusGeometry(5, 0.3, 16, 64, Math.PI);
    const primaryMat = new THREE.MeshStandardMaterial({ 
        color: 0x00aaff, 
        emissive: 0x0055ff, 
        wireframe: true,
        transparent: true
    });
    const primaryTube = new THREE.Mesh(primaryGeo, primaryMat);
    primaryTube.position.set(0, 0.2, 0);
    group.add(primaryTube);

    // 5. secondary magnetic flux tube
    const secondaryGeo = new THREE.TorusGeometry(3, 0.2, 16, 64, Math.PI);
    const secondaryMat = new THREE.MeshStandardMaterial({ 
        color: 0xff5500, 
        emissive: 0xff2200, 
        wireframe: true,
        transparent: true
    });
    const secondaryTube = new THREE.Mesh(secondaryGeo, secondaryMat);
    secondaryTube.position.set(0, 0.2, 1);
    secondaryTube.rotation.x = Math.PI / 6; 
    group.add(secondaryTube);

    // 6. reconnection current sheet
    const sheetGeo = new THREE.PlaneGeometry(3, 3);
    const sheetMat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.0, 
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    const currentSheet = new THREE.Mesh(sheetGeo, sheetMat);
    currentSheet.position.set(0, 6, 0.5);
    group.add(currentSheet);

    // 7. coronal mass ejection bubble
    const cmeGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const cmeMat = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaff, 
        emissive: 0x5555ff, 
        transparent: true, 
        opacity: 0.0,
        blending: THREE.AdditiveBlending
    });
    const cmeBubble = new THREE.Mesh(cmeGeo, cmeMat);
    cmeBubble.position.set(0, 7, 0);
    group.add(cmeBubble);

    // 8. accelerated particle streams
    const particlesCount = 300;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particlesCount * 3);
    for(let i=0; i<particlesCount; i++) {
        pPos[i*3] = (Math.random() - 0.5) * 4;
        pPos[i*3+1] = Math.random() * 4 + 4;
        pPos[i*3+2] = (Math.random() - 0.5) * 2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ 
        color: 0x00ffff, 
        size: 0.15, 
        transparent: true, 
        opacity: 0.8,
        blending: THREE.AdditiveBlending 
    });
    const particleStreams = new THREE.Points(pGeo, pMat);
    group.add(particleStreams);

    // 9. extreme UV flash
    const flashGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const euvFlash = new THREE.Mesh(flashGeo, flashMat);
    euvFlash.position.set(0, 6, 0.5);
    const flashLight = new THREE.PointLight(0xccffff, 0, 50);
    euvFlash.add(flashLight);
    group.add(euvFlash);

    // 10. plasma rain
    const rainCount = 200;
    const rGeo = new THREE.BufferGeometry();
    const rPos = new Float32Array(rainCount * 3);
    for(let i=0; i<rainCount; i++) {
        rPos[i*3] = (Math.random() - 0.5) * 8;
        rPos[i*3+1] = Math.random() * 5 + 1;
        rPos[i*3+2] = (Math.random() - 0.5) * 2;
    }
    rGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3));
    const rMat = new THREE.PointsMaterial({ 
        color: 0xffaa00, 
        size: 0.1, 
        transparent: true, 
        opacity: 0.6,
        blending: THREE.AdditiveBlending 
    });
    const plasmaRain = new THREE.Points(rGeo, rMat);
    group.add(plasmaRain);

    let clockTime = 0;

    group.userData.update = function(dt) {
        clockTime += dt;
        let cycleDuration = 6.0;
        let t = (clockTime % cycleDuration) / cycleDuration; 

        let stretchPhase = Math.max(0, Math.min(1, t / 0.4)); 
        let reconPhase = Math.max(0, Math.min(1, (t - 0.4) / 0.05)); 
        let ejectPhase = Math.max(0, Math.min(1, (t - 0.45) / 0.55));

        if (t < 0.4) {
            primaryTube.scale.set(1, 1 + stretchPhase * 0.8, 1);
            secondaryTube.scale.set(1, 1 + stretchPhase * 1.5, 1);
            secondaryTube.position.y = 0.2 + stretchPhase * 2;
            
            primaryTube.material.opacity = 1.0;
            secondaryTube.material.opacity = 1.0;

            currentSheet.material.opacity = 0;
            euvFlash.material.opacity = 0;
            flashLight.intensity = 0;
            euvFlash.scale.setScalar(0.01);
            
            cmeBubble.material.opacity = 0;
            cmeBubble.position.y = 7;
            cmeBubble.scale.setScalar(0.1);

        } else if (t < 0.45) {
            currentSheet.material.opacity = reconPhase * 0.8;
            
            euvFlash.material.opacity = reconPhase;
            flashLight.intensity = reconPhase * 10;
            euvFlash.scale.setScalar(1 + reconPhase * 2);

            primaryTube.scale.set(1, 1.8 - reconPhase * 0.8, 1); 
            secondaryTube.material.opacity = 1 - reconPhase; 
            
        } else {
            currentSheet.material.opacity = 0.8 * (1 - ejectPhase);
            
            euvFlash.material.opacity = 1 - ejectPhase * 2;
            flashLight.intensity = Math.max(0, 10 - ejectPhase * 20);
            
            cmeBubble.material.opacity = 0.6 * (1 - ejectPhase);
            cmeBubble.position.y = 7 + ejectPhase * 15;
            cmeBubble.scale.setScalar(1 + ejectPhase * 2);

            primaryTube.scale.set(1, 1, 1); 
        }

        const pPositions = particleStreams.geometry.attributes.position.array;
        for(let i=0; i<particlesCount; i++) {
            if (ejectPhase > 0) {
                let x = pPositions[i*3];
                let y = pPositions[i*3+1];
                let z = pPositions[i*3+2];
                
                let targetX = (x > 0) ? 5 : -5;
                let dx = targetX - x;
                let dy = 0 - y;
                
                x += dx * 0.05;
                y += dy * 0.05;
                
                if (y < 0.2) {
                    x = (Math.random() - 0.5) * 4;
                    y = Math.random() * 2 + 5;
                    z = (Math.random() - 0.5) * 2;
                }
                
                pPositions[i*3] = x;
                pPositions[i*3+1] = y;
                pPositions[i*3+2] = z;
            } else {
                pPositions[i*3+1] = 5 + Math.sin(clockTime * 2 + i) * 0.5;
            }
        }
        particleStreams.geometry.attributes.position.needsUpdate = true;

        const rPositions = plasmaRain.geometry.attributes.position.array;
        for(let i=0; i<rainCount; i++) {
            rPositions[i*3+1] -= 0.05; 
            if (rPositions[i*3+1] < 0.2) {
                rPositions[i*3] = (Math.random() - 0.5) * 8;
                rPositions[i*3+1] = Math.random() * 5 + 4;
            }
        }
        plasmaRain.geometry.attributes.position.needsUpdate = true;
        
        currentSheet.rotation.y = clockTime;
        currentSheet.rotation.z = Math.sin(clockTime * 5) * 0.2;
    };

    group.userData.quiz = [
        {
            question: "What is magnetic reconnection?",
            options: [
                "The process of two magnets sticking together",
                "A physical process where magnetic field lines break and reconnect, releasing massive energy",
                "The reversal of the Earth's magnetic poles",
                "The cooling of sunspots"
            ],
            correctAnswer: 1,
            explanation: "Magnetic reconnection is a fundamental process in plasma physics where highly stressed magnetic field lines snap and form new connections, explosively converting magnetic energy into kinetic and thermal energy."
        },
        {
            question: "Where do solar flares primarily draw their immense energy from?",
            options: [
                "Nuclear fusion on the solar surface",
                "Gravitational collapse of the chromosphere",
                "Stored magnetic energy in the corona",
                "Solar wind friction"
            ],
            correctAnswer: 2,
            explanation: "Solar flares are powered by the sudden release of magnetic energy previously stored in the Sun's coronal magnetic fields, triggered by magnetic reconnection."
        },
        {
            question: "What is a Coronal Mass Ejection (CME)?",
            options: [
                "A massive burst of solar wind and magnetic fields rising above the solar corona",
                "A dark, cooler patch on the sun's surface",
                "A steady stream of plasma leaving the sun",
                "The process that creates the solar core"
            ],
            correctAnswer: 0,
            explanation: "A CME is a significant release of plasma and accompanying magnetic field from the solar corona. They often follow solar flares and are normally present during a solar prominence eruption."
        },
        {
            question: "Which solar feature is often the footprint of the magnetic loops involved in flares?",
            options: [
                "Solar granules",
                "Spicules",
                "Sunspots",
                "Solar flares"
            ],
            correctAnswer: 2,
            explanation: "Sunspots are regions of intense magnetic activity. The strong magnetic fields extending from pairs of sunspots of opposite polarity form the magnetic loops where reconnection and flares occur."
        },
        {
            question: "What type of radiation is dramatically increased during a solar flare, affecting Earth's ionosphere?",
            options: [
                "Microwave radiation",
                "Infrared radiation",
                "Extreme Ultraviolet (EUV) and X-rays",
                "Acoustic waves"
            ],
            correctAnswer: 2,
            explanation: "Flares strongly emit in the Extreme Ultraviolet (EUV) and X-ray wavelengths. When these hit Earth, they ionize the upper atmosphere, which can disrupt high-frequency radio communications."
        },
        {
            question: "What does 'plasma rain' (or coronal rain) refer to in the context of solar flares?",
            options: [
                "Water precipitation in the solar atmosphere",
                "Hot coronal plasma cooling down and falling back to the surface along magnetic field lines",
                "Meteors melting as they hit the sun",
                "The solar wind blowing back towards the sun"
            ],
            correctAnswer: 1,
            explanation: "Coronal rain occurs when hot plasma in coronal loops cools rapidly, becomes denser, and falls back down to the solar surface guided by the strong magnetic fields."
        }
    ];

    return group;
}
