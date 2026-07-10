export function createSolarPanel(THREE) {
    const group = new THREE.Group();

    // Dimensions
    const panelWidth = 10;
    const panelHeight = 16;
    const frameThickness = 0.5;
    const layerThickness = 0.1;
    
    // Materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
    });
    
    const arcMaterial = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: 0.2,
        shininess: 100
    });

    const evaMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1
    });

    const cellMaterial = new THREE.MeshStandardMaterial({
        color: 0x001144, // dark blue
        roughness: 0.4,
        metalness: 0.8
    });

    const backsheetMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        roughness: 0.9,
    });

    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        roughness: 0.3,
        metalness: 0.8
    });

    const jboxMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8
    });

    const busbarMaterial = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,
        metalness: 1.0,
        roughness: 0.2
    });

    const diodeMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.7
    });

    const cableMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.6
    });

    // 1. Solar Cells/Wafers (Array)
    const cellsGroup = new THREE.Group();
    const rows = 8;
    const cols = 5;
    const cellWidth = (panelWidth - frameThickness * 2) / cols - 0.2;
    const cellHeight = (panelHeight - frameThickness * 2) / rows - 0.2;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cellGeom = new THREE.BoxGeometry(cellWidth, cellHeight, layerThickness);
            const cell = new THREE.Mesh(cellGeom, cellMaterial);
            cell.position.set(
                -panelWidth / 2 + frameThickness + 0.1 + cellWidth / 2 + c * (cellWidth + 0.2),
                panelHeight / 2 - frameThickness - 0.1 - cellHeight / 2 - r * (cellHeight + 0.2),
                0
            );
            cellsGroup.add(cell);
        }
    }
    group.add(cellsGroup);

    // 2. Glass Cover
    const glassGeom = new THREE.BoxGeometry(panelWidth - frameThickness*1.5, panelHeight - frameThickness*1.5, layerThickness);
    const glass = new THREE.Mesh(glassGeom, glassMaterial);
    glass.position.z = layerThickness * 3;
    group.add(glass);

    // 3. Anti-reflective Coating (ARC)
    const arcGeom = new THREE.BoxGeometry(panelWidth - frameThickness*1.8, panelHeight - frameThickness*1.8, layerThickness * 0.5);
    const arc = new THREE.Mesh(arcGeom, arcMaterial);
    arc.position.z = layerThickness * 1.5;
    group.add(arc);

    // 4. EVA Encapsulant
    const evaGeom = new THREE.BoxGeometry(panelWidth - frameThickness*1.8, panelHeight - frameThickness*1.8, layerThickness * 2.5);
    const eva = new THREE.Mesh(evaGeom, evaMaterial);
    eva.position.z = 0;
    group.add(eva);

    // 5. Backsheet
    const backsheetGeom = new THREE.BoxGeometry(panelWidth - frameThickness*1.5, panelHeight - frameThickness*1.5, layerThickness);
    const backsheet = new THREE.Mesh(backsheetGeom, backsheetMaterial);
    backsheet.position.z = -layerThickness * 2;
    group.add(backsheet);

    // 6. Aluminum Frame
    const frameGroup = new THREE.Group();
    
    // Top/Bottom
    const frameTBGeom = new THREE.BoxGeometry(panelWidth, frameThickness, layerThickness * 8);
    const frameTop = new THREE.Mesh(frameTBGeom, frameMaterial);
    frameTop.position.set(0, panelHeight / 2 - frameThickness / 2, layerThickness);
    const frameBottom = new THREE.Mesh(frameTBGeom, frameMaterial);
    frameBottom.position.set(0, -panelHeight / 2 + frameThickness / 2, layerThickness);
    
    // Left/Right
    const frameLRGeom = new THREE.BoxGeometry(frameThickness, panelHeight - frameThickness * 2, layerThickness * 8);
    const frameLeft = new THREE.Mesh(frameLRGeom, frameMaterial);
    frameLeft.position.set(-panelWidth / 2 + frameThickness / 2, 0, layerThickness);
    const frameRight = new THREE.Mesh(frameLRGeom, frameMaterial);
    frameRight.position.set(panelWidth / 2 - frameThickness / 2, 0, layerThickness);

    frameGroup.add(frameTop, frameBottom, frameLeft, frameRight);
    group.add(frameGroup);

    // 7. Junction Box
    const jboxWidth = 2;
    const jboxHeight = 2;
    const jboxDepth = 0.8;
    const jboxGeom = new THREE.BoxGeometry(jboxWidth, jboxHeight, jboxDepth);
    const jbox = new THREE.Mesh(jboxGeom, jboxMaterial);
    jbox.position.set(0, panelHeight / 2 - 2, -layerThickness * 2 - jboxDepth / 2);
    group.add(jbox);

    // 8. Busbars
    const busbarsGroup = new THREE.Group();
    const busbarWidth = 0.05;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Three vertical busbars per cell
            for (let b = 0; b < 3; b++) {
                const busbarGeom = new THREE.BoxGeometry(busbarWidth, cellHeight * 0.9, layerThickness * 0.2);
                const busbar = new THREE.Mesh(busbarGeom, busbarMaterial);
                const cellX = -panelWidth / 2 + frameThickness + 0.1 + cellWidth / 2 + c * (cellWidth + 0.2);
                const cellY = panelHeight / 2 - frameThickness - 0.1 - cellHeight / 2 - r * (cellHeight + 0.2);
                
                busbar.position.set(
                    cellX + (b - 1) * (cellWidth * 0.25),
                    cellY,
                    layerThickness * 0.6
                );
                busbarsGroup.add(busbar);
            }
        }
    }
    group.add(busbarsGroup);

    // 9. Bypass Diodes
    const diodesGroup = new THREE.Group();
    for (let d = 0; d < 3; d++) {
        const diodeGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16);
        const diode = new THREE.Mesh(diodeGeom, diodeMaterial);
        diode.rotation.z = Math.PI / 2;
        diode.position.set((d - 1) * 0.6, panelHeight / 2 - 2, -layerThickness * 2 - jboxDepth - 0.1);
        diodesGroup.add(diode);
    }
    group.add(diodesGroup);

    // 10. Output Cables
    const cablesGroup = new THREE.Group();
    const cableGeom = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    const posCable = new THREE.Mesh(cableGeom, cableMaterial);
    posCable.rotation.x = Math.PI / 2;
    posCable.position.set(0.5, panelHeight / 2 - 2, -layerThickness * 2 - jboxDepth - 2);
    const negCable = new THREE.Mesh(cableGeom, cableMaterial);
    negCable.rotation.x = Math.PI / 2;
    negCable.position.set(-0.5, panelHeight / 2 - 2, -layerThickness * 2 - jboxDepth - 2);
    
    // Add Connectors
    const connectorGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16);
    const posConnector = new THREE.Mesh(connectorGeom, jboxMaterial);
    posConnector.rotation.x = Math.PI / 2;
    posConnector.position.set(0.5, panelHeight / 2 - 2, -layerThickness * 2 - jboxDepth - 4);
    const negConnector = new THREE.Mesh(connectorGeom, jboxMaterial);
    negConnector.rotation.x = Math.PI / 2;
    negConnector.position.set(-0.5, panelHeight / 2 - 2, -layerThickness * 2 - jboxDepth - 4);

    cablesGroup.add(posCable, negCable, posConnector, negConnector);
    group.add(cablesGroup);

    // Particles for Animation
    const particlesGroup = new THREE.Group();
    group.add(particlesGroup);
    
    // Photons
    const photonGeom = new THREE.SphereGeometry(0.1, 8, 8);
    const photonMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const photons = [];
    for(let i=0; i<30; i++) {
        const p = new THREE.Mesh(photonGeom, photonMat);
        p.position.set(
            (Math.random() - 0.5) * panelWidth,
            (Math.random() - 0.5) * panelHeight,
            5 + Math.random() * 5
        );
        p.userData = {
            speed: 5 + Math.random() * 5,
            active: true
        };
        photons.push(p);
        particlesGroup.add(p);
    }

    // Electron-Hole pairs
    const electronGeom = new THREE.SphereGeometry(0.05, 8, 8);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const holeGeom = new THREE.SphereGeometry(0.05, 8, 8);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    
    const pairs = [];
    
    // Current flow (electrons in busbars)
    const currentElectrons = [];
    for(let i=0; i<50; i++) {
        const e = new THREE.Mesh(electronGeom, electronMat);
        // Bind to a random busbar lane roughly
        e.userData = {
            col: Math.floor(Math.random() * cols),
            b: Math.floor(Math.random() * 3),
            y: (Math.random() - 0.5) * panelHeight,
            speed: 2 + Math.random() * 2
        };
        e.position.set(0,0,0);
        currentElectrons.push(e);
        particlesGroup.add(e);
    }

    function update(delta) {
        // Update photons
        photons.forEach(p => {
            if (p.userData.active) {
                p.position.z -= p.userData.speed * delta;
                if (p.position.z < layerThickness) {
                    // Photon hits cell
                    p.userData.active = false;
                    p.position.z = 5 + Math.random() * 5;
                    p.position.x = (Math.random() - 0.5) * panelWidth;
                    p.position.y = (Math.random() - 0.5) * panelHeight;
                    
                    // Create an electron-hole pair at impact
                    const electron = new THREE.Mesh(electronGeom, electronMat);
                    const hole = new THREE.Mesh(holeGeom, holeMat);
                    electron.position.set(p.position.x, p.position.y, layerThickness);
                    hole.position.set(p.position.x, p.position.y, layerThickness);
                    
                    electron.userData = { vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2, life: 1.0 };
                    hole.userData = { vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2, life: 1.0 };
                    
                    particlesGroup.add(electron);
                    particlesGroup.add(hole);
                    pairs.push({e: electron, h: hole});
                    
                    setTimeout(() => p.userData.active = true, 500 + Math.random()*500);
                }
            }
        });

        // Update pairs (separation)
        for(let i = pairs.length - 1; i >= 0; i--) {
            const pair = pairs[i];
            pair.e.position.x += pair.e.userData.vx * delta;
            pair.e.position.y += pair.e.userData.vy * delta;
            pair.h.position.x -= pair.h.userData.vx * delta; // opposite direction
            pair.h.position.y -= pair.h.userData.vy * delta;
            pair.e.userData.life -= delta;
            
            // Fade out or remove
            if (pair.e.userData.life <= 0) {
                particlesGroup.remove(pair.e);
                particlesGroup.remove(pair.h);
                pairs.splice(i, 1);
            }
        }

        // Update current flow in busbars
        currentElectrons.forEach(e => {
            e.userData.y += e.userData.speed * delta;
            if (e.userData.y > panelHeight / 2) {
                e.userData.y = -panelHeight / 2;
            }
            
            const cellX = -panelWidth / 2 + frameThickness + 0.1 + cellWidth / 2 + e.userData.col * (cellWidth + 0.2);
            e.position.set(
                cellX + (e.userData.b - 1) * (cellWidth * 0.25),
                e.userData.y,
                layerThickness * 0.8
            );
        });
    }

    const quiz = [
        {
            question: "Which physical phenomenon describes the emission of electrons when light hits a material?",
            options: ["Thermoelectric effect", "Photoelectric effect", "Piezoelectric effect", "Compton scattering"],
            correctAnswer: 1
        },
        {
            question: "What is the 'band gap' in a semiconductor?",
            options: ["The physical distance between two solar cells", "The energy required to excite an electron from the valence band to the conduction band", "The gap between the glass cover and the solar cells", "The range of wavelengths a solar panel cannot absorb"],
            correctAnswer: 1
        },
        {
            question: "Which material is most commonly used to manufacture commercial solar wafers?",
            options: ["Gallium Arsenide", "Cadmium Telluride", "Silicon", "Perovskite"],
            correctAnswer: 2
        },
        {
            question: "What is the purpose of the anti-reflective coating on a solar cell?",
            options: ["To prevent the solar panel from blinding pilots", "To maximize the amount of light absorbed by the cell by reducing reflection", "To protect the cell from UV degradation", "To increase the panel's physical strength"],
            correctAnswer: 1
        },
        {
            question: "Why are bypass diodes used in solar panels?",
            options: ["To convert DC to AC", "To prevent power loss and hot spots when part of the panel is shaded", "To increase the voltage output of the panel", "To monitor the current flow in real time"],
            correctAnswer: 1
        },
        {
            question: "What is the theoretical maximum efficiency limit of a single-junction solar cell known as?",
            options: ["Carnot Limit", "Shockley-Queisser Limit", "Betz Limit", "Nyquist Limit"],
            correctAnswer: 1
        }
    ];

    return {
        mesh: group,
        update: update,
        quiz: quiz
    };
}
