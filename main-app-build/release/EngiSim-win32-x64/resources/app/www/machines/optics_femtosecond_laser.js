import { allMaterials as mat, tinted } from '../utils/materials.js';

export function createFemtosecondLaserSystem(THREE) {
    const group = new THREE.Group();
    group.name = "Femtosecond Laser System";
    const animationClips = [];

    // Optical Breadboard
    const boardGeo = new THREE.BoxGeometry(16, 0.5, 8);
    const board = new THREE.Mesh(boardGeo, mat.darkSteel);
    board.position.y = -0.25;
    group.add(board);

    // Pump Laser
    const pumpGeo = new THREE.BoxGeometry(3, 1.5, 1.5);
    const pump = new THREE.Mesh(pumpGeo, mat.blueAccent);
    pump.position.set(-6, 0.75, 0);
    group.add(pump);

    // Ti:Sapphire Crystal
    const crystalGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const crystalMat = tinted(mat.glass, 0xff2222);
    crystalMat.emissive = new THREE.Color(0xaa0000);
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(-2, 0.5, 0);
    group.add(crystal);

    // Mirrors
    const createMirror = (x, z, ry) => {
        const mGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
        const m = new THREE.Mesh(mGeo, mat.chrome);
        m.position.set(x, 0.5, z);
        m.rotation.set(Math.PI/2, 0, ry);
        
        const mountGeo = new THREE.BoxGeometry(0.2, 1, 0.2);
        const mount = new THREE.Mesh(mountGeo, mat.aluminum);
        mount.position.set(x - 0.2*Math.cos(ry), 0.5, z + 0.2*Math.sin(ry));
        group.add(mount);
        group.add(m);
    };

    createMirror(0, 2, Math.PI/4);
    createMirror(3, 2, -Math.PI/4);
    createMirror(3, -2, Math.PI/4);
    createMirror(6, -2, 0);

    // Laser Beam (Pump & Femto)
    const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    
    // Pump beam
    const pumpBeamMat = tinted(mat.glass, 0x00ff00);
    pumpBeamMat.emissive = new THREE.Color(0x00ff00);
    const pumpBeam = new THREE.Mesh(beamGeo, pumpBeamMat);
    pumpBeam.rotation.z = Math.PI/2;
    pumpBeam.position.set(-4, 0.5, 0);
    group.add(pumpBeam);

    // Femto pulses
    const pulseMat = tinted(mat.glass, 0xff0000);
    pulseMat.emissive = new THREE.Color(0xff0000);
    
    const pulses = [];
    for(let i=0; i<5; i++) {
        const pulse = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8), pulseMat);
        pulse.rotation.z = Math.PI/2;
        group.add(pulse);
        pulses.push(pulse);
    }

    // Animation
    const times = [0, 1, 2];
    const tracks = [];
    
    // Pulsing crystal glow
    tracks.push(new THREE.NumberKeyframeTrack(`${crystal.uuid}.material.emissiveIntensity`, [0, 0.5, 1, 1.5, 2], [0.5, 1.5, 0.5, 1.5, 0.5]));

    // Move pulses along the path
    pulses.forEach((pulse, i) => {
        const pTimes = [];
        const pValues = [];
        for(let f=0; f<=40; f++) {
            let t = f/20; // 0 to 2 seconds
            let phase = (t + i*0.4) % 2; 
            
            // path mapping:
            let x=0, z=0, rz = Math.PI/2, ry = 0;
            if(phase < 0.5) {
                // -2,0 to 0,2
                let t_path = phase / 0.5;
                x = -2 + 2*t_path;
                z = 2*t_path;
                ry = Math.PI/4;
            } else if(phase < 1.0) {
                // 0,2 to 3,2
                let t_path = (phase - 0.5) / 0.5;
                x = 0 + 3*t_path;
                z = 2;
                ry = 0;
            } else if(phase < 1.5) {
                // 3,2 to 3,-2
                let t_path = (phase - 1.0) / 0.5;
                x = 3;
                z = 2 - 4*t_path;
                ry = Math.PI/2;
            } else {
                // 3,-2 to 6,-2
                let t_path = (phase - 1.5) / 0.5;
                x = 3 + 3*t_path;
                z = -2;
                ry = 0;
            }
            pTimes.push(t);
            pValues.push(x, 0.5, z);
        }
        tracks.push(new THREE.VectorKeyframeTrack(`${pulse.uuid}.position`, pTimes, pValues));
    });

    const clip = new THREE.AnimationClip('FemtoPulses', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
