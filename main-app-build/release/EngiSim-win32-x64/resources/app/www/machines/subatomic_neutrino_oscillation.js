export function createNeutrinoOscillation(THREE) {
    const group = new THREE.Group();
    group.name = "NeutrinoOscillationGroup";
    const animationClips = [];

    // Path of the neutrino
    const points = [];
    for(let i=0; i<=200; i++) {
        const x = i * 0.1 - 10;
        const y = Math.sin(x) * 1.5;
        const z = Math.cos(x) * 1.5;
        points.push(new THREE.Vector3(x, y, z));
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.4 });
    const line = new THREE.Line(lineGeo, lineMat);
    group.add(line);

    // The neutrino modeled as three overlapping probability states (flavors)
    const nGeo = new THREE.SphereGeometry(0.8, 32, 32);
    
    // Electron Neutrino (Blue)
    const matElectron = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0044ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const nE = new THREE.Mesh(nGeo, matElectron);
    nE.name = "flavorElectron";
    
    // Muon Neutrino (Green)
    const matMuon = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x008822, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const nM = new THREE.Mesh(nGeo, matMuon);
    nM.name = "flavorMuon";

    // Tau Neutrino (Red)
    const matTau = new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: 0xaa1111, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const nT = new THREE.Mesh(nGeo, matTau);
    nT.name = "flavorTau";

    group.add(nE, nM, nT);

    // Oscillation animations using scale to represent probability amplitude
    const times = [0, 1.5, 3, 4.5, 6];
    
    // Electron flavor
    const sE = new THREE.VectorKeyframeTrack('flavorElectron.scale', times, [1,1,1, 0.001,0.001,0.001, 0.001,0.001,0.001, 1,1,1, 1,1,1]);
    // Muon flavor
    const sM = new THREE.VectorKeyframeTrack('flavorMuon.scale', times, [0.001,0.001,0.001, 1,1,1, 0.001,0.001,0.001, 0.001,0.001,0.001, 0.001,0.001,0.001]);
    // Tau flavor
    const sT = new THREE.VectorKeyframeTrack('flavorTau.scale', times, [0.001,0.001,0.001, 0.001,0.001,0.001, 1,1,1, 0.001,0.001,0.001, 0.001,0.001,0.001]);

    // Generate position track following the path
    const posTimes = [];
    const posValues = [];
    const steps = 60;
    for(let i=0; i<=steps; i++) {
        const t = (i / steps) * 6; // 6 seconds total
        posTimes.push(t);
        const x = (i / steps) * 20 - 10;
        const y = Math.sin(x) * 1.5;
        const z = Math.cos(x) * 1.5;
        posValues.push(x, y, z);
    }
    
    const pE = new THREE.VectorKeyframeTrack('flavorElectron.position', posTimes, posValues);
    const pM = new THREE.VectorKeyframeTrack('flavorMuon.position', posTimes, posValues);
    const pT = new THREE.VectorKeyframeTrack('flavorTau.position', posTimes, posValues);

    const clip = new THREE.AnimationClip('OscillationCycle', 6, [sE, sM, sT, pE, pM, pT]);
    animationClips.push(clip);

    return { group, animationClips };
}
