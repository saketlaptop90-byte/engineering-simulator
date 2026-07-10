import * as materials from '../utils/materials.js';

export function createHallEffectThrusterGrid(THREE) {
    const gridGroup = new THREE.Group();
    const matMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x778899, metalness: 0.7, roughness: 0.3 });
    const matCeramic = materials.ceramic || new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.1, roughness: 0.8 });
    const matPlasma = materials.plasma || new THREE.MeshBasicMaterial({ color: 0x0055ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });

    const createSingleThruster = () => {
        const group = new THREE.Group();
        
        // Thruster Body Outer Case
        const bodyGeo = new THREE.CylinderGeometry(1, 1, 1.5, 32);
        const body = new THREE.Mesh(bodyGeo, matMetal);
        body.rotation.x = Math.PI / 2;
        group.add(body);

        // Boron Nitride Ceramic Discharge Channel
        const channelGeo = new THREE.TorusGeometry(0.6, 0.2, 16, 64);
        const channel = new THREE.Mesh(channelGeo, matCeramic);
        channel.position.z = 0.75;
        group.add(channel);

        // Center Magnetic Pole Piece
        const poleGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
        const pole = new THREE.Mesh(poleGeo, matMetal);
        pole.rotation.x = Math.PI / 2;
        pole.position.z = 0.75;
        group.add(pole);

        // External Hollow Cathode Electron Emitter
        const cathodeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16);
        const cathode = new THREE.Mesh(cathodeGeo, matMetal);
        cathode.rotation.x = Math.PI / 2;
        cathode.position.set(1.1, 0, 0.75);
        group.add(cathode);

        // Hall Current Plasma Ring
        const plasmaGeo = new THREE.TorusGeometry(0.6, 0.15, 16, 64);
        const plasmaRing = new THREE.Mesh(plasmaGeo, matPlasma);
        plasmaRing.position.z = 0.85;
        group.add(plasmaRing);

        // Plasma Exhaust Plume
        const plumeGeo = new THREE.CylinderGeometry(0.6, 1.5, 4, 32, 1, true);
        const plume = new THREE.Mesh(plumeGeo, matPlasma);
        plume.rotation.x = Math.PI / 2;
        plume.position.z = 2.85;
        group.add(plume);

        return { group, plume };
    };

    const thrusters = [];
    const positions = [
        [-1.5, -1.5, 0],
        [1.5, -1.5, 0],
        [-1.5, 1.5, 0],
        [1.5, 1.5, 0]
    ];

    positions.forEach(pos => {
        const thrusterObj = createSingleThruster();
        thrusterObj.group.position.set(pos[0], pos[1], pos[2]);
        gridGroup.add(thrusterObj.group);
        thrusters.push(thrusterObj);
    });

    // Central structural frame mounting the grid
    const frameGeo = new THREE.BoxGeometry(4.5, 4.5, 0.5);
    const frame = new THREE.Mesh(frameGeo, matMetal);
    frame.position.z = -0.5;
    gridGroup.add(frame);

    const animationClips = [];
    
    // Animation for synchronized plumes
    const tracks = [];
    thrusters.forEach(t => {
        const track = new THREE.VectorKeyframeTrack(
            t.plume.uuid + '.scale',
            [0, 0.5, 1],
            [1, 1, 1,  1.1, 1, 1.2,  1, 1, 1]
        );
        tracks.push(track);
    });

    const clip = new THREE.AnimationClip('GridFire_Hall', 1, tracks);
    animationClips.push(clip);

    return { group: gridGroup, animationClips };
}
