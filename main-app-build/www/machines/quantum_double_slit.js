export function createQuantumDoubleSlit(THREE) {
    const group = new THREE.Group();

    // 1. Electron Gun Body
    const gunBodyGeo = new THREE.BoxGeometry(4, 4, 10);
    const gunBodyMat = new THREE.MeshStandardMaterial({color: 0x444444});
    const gunBody = new THREE.Mesh(gunBodyGeo, gunBodyMat);
    gunBody.position.set(0, 0, 55);
    group.add(gunBody);

    // 2. Electron Gun Nozzle
    const gunNozzleGeo = new THREE.CylinderGeometry(1, 1, 5, 16);
    const gunNozzleMat = new THREE.MeshStandardMaterial({color: 0x888888});
    const gunNozzle = new THREE.Mesh(gunNozzleGeo, gunNozzleMat);
    gunNozzle.rotation.x = Math.PI / 2;
    gunNozzle.position.set(0, 0, 50);
    group.add(gunNozzle);

    // 3. Beam Path Indicator
    const beamPathGeo = new THREE.CylinderGeometry(1.5, 4, 50, 16);
    const beamPathMat = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.05, side: THREE.DoubleSide});
    const beamPath = new THREE.Mesh(beamPathGeo, beamPathMat);
    beamPath.rotation.x = Math.PI / 2;
    beamPath.position.set(0, 0, 25);
    group.add(beamPath);

    // 4. Barrier Left
    const barrierLeftGeo = new THREE.BoxGeometry(15, 20, 1);
    const barrierMat = new THREE.MeshStandardMaterial({color: 0x1111aa});
    const barrierLeft = new THREE.Mesh(barrierLeftGeo, barrierMat);
    barrierLeft.position.set(-10, 0, 0); 
    group.add(barrierLeft);

    // 5. Barrier Middle
    const barrierMiddleGeo = new THREE.BoxGeometry(3, 20, 1);
    const barrierMiddle = new THREE.Mesh(barrierMiddleGeo, barrierMat);
    barrierMiddle.position.set(0, 0, 0); 
    group.add(barrierMiddle);

    // 6. Barrier Right
    const barrierRightGeo = new THREE.BoxGeometry(15, 20, 1);
    const barrierRight = new THREE.Mesh(barrierRightGeo, barrierMat);
    barrierRight.position.set(10, 0, 0); 
    group.add(barrierRight);

    // 7. Detector Instrument
    const detectorGeo = new THREE.BoxGeometry(2, 2, 2);
    const detectorMat = new THREE.MeshStandardMaterial({color: 0xff0000});
    const detectorBox = new THREE.Mesh(detectorGeo, detectorMat);
    detectorBox.position.set(-2, 11, 0); 
    group.add(detectorBox);

    // 8. Observation Screen Base
    const screenGeo = new THREE.BoxGeometry(40, 20, 1);
    const screenMat = new THREE.MeshStandardMaterial({color: 0x222222});
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0, -50.5);
    group.add(screen);

    // 9. Interference Pattern Screen (Dynamic)
    let patternTex = null;
    if (typeof document !== 'undefined') {
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = 512;
        patternCanvas.height = 128;
        const ctx = patternCanvas.getContext('2d');
        for (let i = 0; i < 512; i++) {
            let x = (i / 512 - 0.5) * 40;
            let theta = Math.atan(x / 50);
            let alpha = Math.PI * 1 * Math.sin(theta) / 1.5;
            let beta = Math.PI * 4 * Math.sin(theta) / 1.5;
            let sinc = alpha === 0 ? 1 : Math.sin(alpha)/alpha;
            let intensity = Math.pow(Math.cos(beta), 2) * Math.pow(sinc, 2);
            let c = Math.floor(intensity * 255);
            ctx.fillStyle = `rgb(0, ${c}, ${Math.floor(c/2)})`;
            ctx.fillRect(i, 0, 1, 128);
        }
        patternTex = new THREE.CanvasTexture(patternCanvas);
    }
    const patternGeo = new THREE.PlaneGeometry(40, 20);
    const patternMat = new THREE.MeshBasicMaterial({
        map: patternTex, 
        transparent: true, 
        opacity: 0.9, 
        blending: THREE.AdditiveBlending,
        color: patternTex ? 0xffffff : 0x00ffff // Fallback color
    });
    const patternMesh = new THREE.Mesh(patternGeo, patternMat);
    patternMesh.position.set(0, 0, -49.9);
    group.add(patternMesh);

    // 10. Quantum Particles Collection
    const particlesGroup = new THREE.Group();
    group.add(particlesGroup);
    
    const particleGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({color: 0xffffff});
    for (let i = 0; i < 200; i++) {
        const p = new THREE.Mesh(particleGeo, particleMat);
        p.userData.reset = function() {
            p.position.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 50);
            p.userData.vx = (Math.random() - 0.5) * 0.2;
            p.userData.vy = (Math.random() - 0.5) * 0.2;
            p.userData.vz = -15 - Math.random() * 10;
            p.userData.state = 0; // 0: gun->slit, 1: slit->screen, 2: blocked, 3: hit screen
            p.userData.deadTime = null;
        };
        p.userData.reset();
        p.position.z -= Math.random() * 100;
        if (p.position.z < 0) p.position.z += 50; 
        particlesGroup.add(p);
    }

    // Kinematics Animation Logic
    group.userData.update = function(delta, time) {
        particlesGroup.children.forEach(p => {
            let prevZ = p.position.z;
            p.position.x += p.userData.vx * delta;
            p.position.y += p.userData.vy * delta;
            p.position.z += p.userData.vz * delta;

            // Barrier Collision check
            if (prevZ > 0 && p.position.z <= 0) {
                let x = p.position.x;
                let y = p.position.y;
                let inSlit1 = (x > -2.5 && x < -1.5 && y > -10 && y < 10);
                let inSlit2 = (x > 1.5 && x < 2.5 && y > -10 && y < 10);

                if (inSlit1 || inSlit2) {
                    p.userData.state = 1; 
                    let targetX;
                    // Rejection sampling for quantum probability intensity
                    while(true) {
                        let tx = (Math.random() - 0.5) * 40;
                        let theta = Math.atan(tx / 50);
                        let alpha = Math.PI * 1 * Math.sin(theta) / 1.5;
                        let beta = Math.PI * 4 * Math.sin(theta) / 1.5;
                        let sinc = alpha === 0 ? 1 : Math.sin(alpha)/alpha;
                        let intensity = Math.pow(Math.cos(beta), 2) * Math.pow(sinc, 2);
                        if (Math.random() < intensity) {
                            targetX = tx;
                            break;
                        }
                    }
                    let targetY = p.position.y + (Math.random() - 0.5) * 5;
                    let travelTime = 50 / Math.abs(p.userData.vz); 
                    p.userData.vx = (targetX - p.position.x) / travelTime;
                    p.userData.vy = (targetY - p.position.y) / travelTime;
                } else {
                    p.userData.state = 2;
                    p.position.z = 0.1;
                    p.userData.vz = 0;
                    p.userData.vx = 0;
                    p.userData.vy = 0;
                }
            }

            // Hit screen check
            if (p.position.z < -49.8 && p.userData.state === 1) {
                p.userData.state = 3;
                p.position.z = -49.8;
                p.userData.vz = 0;
                p.userData.vx = 0;
                p.userData.vy = 0;
            }

            // Reset dead or blocked particles
            if (p.userData.state === 2 || p.userData.state === 3) {
                if (!p.userData.deadTime) {
                    p.userData.deadTime = time;
                }
                if (time - p.userData.deadTime > 1.5) {
                    p.userData.reset();
                }
            }
        });
    };

    // 6 Quiz Questions
    group.userData.quiz = [
        {
            question: "What causes the interference pattern in the quantum double-slit experiment?",
            options: ["Particles bouncing off the slit edges", "The wave-particle duality of matter", "Errors in measurement instruments", "Electromagnetism from the barrier"],
            correct: 1
        },
        {
            question: "What happens to the interference pattern if a detector is placed to observe which slit the particle passes through?",
            options: ["The pattern becomes sharper", "The pattern shifts to the left", "The interference pattern disappears", "Nothing changes"],
            correct: 2
        },
        {
            question: "In quantum mechanics, what does the wave function describe?",
            options: ["The exact path a particle takes", "The probability amplitude of a particle's state", "The gravitational field of the particle", "The kinetic energy loss over time"],
            correct: 1
        },
        {
            question: "Which pattern is observed on the screen when particles are fired one at a time and not observed at the slits?",
            options: ["Two distinct bands behind the slits", "An interference pattern that builds up over time", "A uniform distribution of impacts", "A single central band"],
            correct: 1
        },
        {
            question: "Who originally performed the double-slit experiment using light?",
            options: ["Albert Einstein", "Isaac Newton", "Thomas Young", "Niels Bohr"],
            correct: 2
        },
        {
            question: "The disappearance of the interference pattern when measured at the slits is often attributed to what quantum mechanical principle?",
            options: ["Wave function collapse", "Heisenberg's Uncertainty Principle", "Quantum entanglement", "Pauli exclusion principle"],
            correct: 0
        }
    ];

    return group;
}
