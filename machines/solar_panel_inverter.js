import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. The Solar Panel ---
    const panelGeo = new THREE.BoxGeometry(4, 0.1, 6);
    const panelMat = new THREE.MeshStandardMaterial({
        color: 0x001133,
        metalness: 0.8,
        roughness: 0.2
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(-3, 2, 0);
    panel.rotation.z = Math.PI / 6; // Angled towards the "sun"
    panel.userData = { id: 'solar_panel', name: 'Photovoltaic Array', description: 'Silicon cells that absorb photons and release electrons due to the photoelectric effect.' };
    group.add(panel);

    // Silver grid lines on panel
    const gridGeo = new THREE.PlaneGeometry(3.9, 5.9);
    const gridMat = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = 0.051;
    panel.add(grid);

    // --- 2. The Inverter & Battery ---
    const inverterGeo = new THREE.BoxGeometry(2, 2.5, 1);
    const inverterMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.5 });
    const inverter = new THREE.Mesh(inverterGeo, inverterMat);
    inverter.position.set(3, 1.25, 0);
    inverter.userData = { id: 'inverter', name: 'Solar Inverter', description: 'Converts Direct Current (DC) from the panels into Alternating Current (AC) for home use.' };
    group.add(inverter);

    const screenGeo = new THREE.PlaneGeometry(1.5, 0.8);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.5, 0.51);
    inverter.add(screen);

    // --- 3. Wires ---
    // A wire connecting panel to inverter
    const wirePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3, 1.5, 0),
        new THREE.Vector3(-1, 0.5, 0),
        new THREE.Vector3(2, 0.5, 0),
        new THREE.Vector3(3, 1.25, 0)
    ]);
    const wireGeo = new THREE.TubeGeometry(wirePath, 20, 0.05, 8, false);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    group.add(wire);

    // --- 4. Particle Systems ---
    // Photons (Yellow particles coming from above)
    const photonCount = 100;
    const photonGeo = new THREE.BufferGeometry();
    const photonPos = new Float32Array(photonCount * 3);
    for(let i=0; i<photonCount; i++){
        photonPos[i*3] = -5 + Math.random() * 4; // X
        photonPos[i*3+1] = 6 + Math.random() * 4; // Y
        photonPos[i*3+2] = -3 + Math.random() * 6; // Z
    }
    photonGeo.setAttribute('position', new THREE.BufferAttribute(photonPos, 3));
    const photonMat = new THREE.PointsMaterial({ color: 0xffff00, size: 0.15, blending: THREE.AdditiveBlending, transparent: true });
    const photons = new THREE.Points(photonGeo, photonMat);
    photons.userData = { id: 'photons', name: 'Solar Photons', description: 'Light energy traveling from the sun.' };
    group.add(photons);

    // Electrons in wire (DC Current)
    const electronCount = 50;
    const electronGeo = new THREE.BufferGeometry();
    const electronPos = new Float32Array(electronCount * 3);
    const electronProgress = new Float32Array(electronCount); // 0 to 1 along the curve
    for(let i=0; i<electronCount; i++){
        electronProgress[i] = Math.random();
        const pt = wirePath.getPoint(electronProgress[i]);
        electronPos[i*3] = pt.x;
        electronPos[i*3+1] = pt.y;
        electronPos[i*3+2] = pt.z;
    }
    electronGeo.setAttribute('position', new THREE.BufferAttribute(electronPos, 3));
    electronGeo.setAttribute('progress', new THREE.BufferAttribute(electronProgress, 1));
    const electronMat = new THREE.PointsMaterial({ color: 0x0088ff, size: 0.12, blending: THREE.AdditiveBlending, transparent: true });
    const electrons = new THREE.Points(electronGeo, electronMat);
    electrons.userData = { id: 'dc_electrons', name: 'Direct Current (DC)', description: 'Electrons flowing in a single direction from the solar panel.' };
    group.add(electrons);

    // AC Output (Oscillating wave)
    const acPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(3, 1.25, 0),
        new THREE.Vector3(5, 1.25, 0)
    ]);
    const acWireGeo = new THREE.TubeGeometry(acPath, 10, 0.05, 8, false);
    const acWire = new THREE.Mesh(acWireGeo, wireMat);
    group.add(acWire);

    const acElectronCount = 30;
    const acElectronGeo = new THREE.BufferGeometry();
    const acElectronPos = new Float32Array(acElectronCount * 3);
    for(let i=0; i<acElectronCount; i++){
        acElectronPos[i*3] = 3 + (i/acElectronCount)*2;
        acElectronPos[i*3+1] = 1.25;
        acElectronPos[i*3+2] = 0;
    }
    acElectronGeo.setAttribute('position', new THREE.BufferAttribute(acElectronPos, 3));
    const acMat = new THREE.PointsMaterial({ color: 0xff0000, size: 0.15, blending: THREE.AdditiveBlending, transparent: true });
    const acElectrons = new THREE.Points(acElectronGeo, acMat);
    acElectrons.userData = { id: 'ac_electrons', name: 'Alternating Current (AC)', description: 'Electrons oscillating back and forth rapidly, ready for household appliances.' };
    group.add(acElectrons);

    // --- 5. Animation ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;

        // Animate Photons
        const pPos = photons.geometry.attributes.position.array;
        for(let i=0; i<photonCount; i++){
            pPos[i*3+1] -= delta * 5; // Fall down
            pPos[i*3] += delta * 1.5; // Angle slightly
            if(pPos[i*3+1] < 1.5) { // Reset near panel
                pPos[i*3] = -5 + Math.random() * 4;
                pPos[i*3+1] = 6 + Math.random() * 4;
                pPos[i*3+2] = -3 + Math.random() * 6;
            }
        }
        photons.geometry.attributes.position.needsUpdate = true;

        // Animate DC Electrons along wire
        const ePos = electrons.geometry.attributes.position.array;
        const eProg = electrons.geometry.attributes.progress.array;
        for(let i=0; i<electronCount; i++){
            eProg[i] += delta * 0.2;
            if(eProg[i] > 1) eProg[i] = 0;
            const pt = wirePath.getPoint(eProg[i]);
            ePos[i*3] = pt.x;
            ePos[i*3+1] = pt.y;
            ePos[i*3+2] = pt.z;
        }
        electrons.geometry.attributes.position.needsUpdate = true;
        electrons.geometry.attributes.progress.needsUpdate = true;

        // Animate AC Electrons (Oscillation)
        const acPos = acElectrons.geometry.attributes.position.array;
        for(let i=0; i<acElectronCount; i++){
            const baseX = 3 + (i/acElectronCount)*2;
            // Oscillate X position around the base position
            acPos[i*3] = baseX + Math.sin(time * 10 + i) * 0.1; 
        }
        acElectrons.geometry.attributes.position.needsUpdate = true;

        // Blinking screen on inverter
        screenMat.color.setHSL(0.3, 1.0, 0.2 + (Math.sin(time*5)*0.3));
    };

    return group;
}
