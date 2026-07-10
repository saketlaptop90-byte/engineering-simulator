import * as materials from '../utils/materials.js';

export function createDroneSwarm(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bodyMat = materials.droneBody || new THREE.MeshStandardMaterial({color: 0xeeeeee, metalness: 0.3});
    const propMat = materials.droneProp || new THREE.MeshStandardMaterial({color: 0x333333, transparent: true, opacity: 0.6});
    const glowMat = materials.droneGlow || new THREE.MeshBasicMaterial({color: 0x00ffcc});

    for (let i = 0; i < 12; i++) {
        const drone = new THREE.Group();
        
        // Arrange drones in a rough spherical/cylindrical formation initially
        const startX = Math.cos(i) * 3 + (Math.random() - 0.5);
        const startY = (i * 0.4) + 1 + (Math.random() - 0.5);
        const startZ = Math.sin(i) * 3 + (Math.random() - 0.5);
        
        drone.position.set(startX, startY, startZ);
        drone.name = `Drone_${i}`;
        
        // Drone core
        const coreGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
        const core = new THREE.Mesh(coreGeo, bodyMat);
        drone.add(core);

        // LED Indicator
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), glowMat);
        led.position.y = 0.06;
        drone.add(led);

        // 4 Propellers
        const propPos = [
            [0.25, 0.05, 0.25], 
            [-0.25, 0.05, 0.25], 
            [0.25, 0.05, -0.25], 
            [-0.25, 0.05, -0.25]
        ];

        propPos.forEach((p, pi) => {
            // Arm
            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.02), bodyMat);
            arm.position.set(p[0]/2, 0, p[2]/2);
            arm.lookAt(new THREE.Vector3(p[0], 0, p[2]));
            drone.add(arm);

            // Propeller blade
            const prop = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.01, 16), propMat);
            prop.position.set(p[0], p[1], p[2]);
            prop.name = `Prop_${i}_${pi}`;
            drone.add(prop);

            // High-speed propeller spin animation
            const times = [0, 0.5];
            const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
            const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
            const track = new THREE.QuaternionKeyframeTrack(`${prop.name}.quaternion`, times, [
                q0.x, q0.y, q0.z, q0.w,
                q1.x, q1.y, q1.z, q1.w
            ]);
            animationClips.push(new THREE.AnimationClip(`Spin_${i}_${pi}`, 0.5, [track]));
        });

        group.add(drone);

        // Swarming Hover animation
        const timesHover = [0, 2, 4];
        const randomOffsetX = (Math.random() - 0.5) * 1.5;
        const randomOffsetY = (Math.random() - 0.5) * 1.5;
        const randomOffsetZ = (Math.random() - 0.5) * 1.5;

        const valsHover = [
            startX, startY, startZ,
            startX + randomOffsetX, startY + randomOffsetY, startZ + randomOffsetZ,
            startX, startY, startZ
        ];
        
        const hoverTrack = new THREE.VectorKeyframeTrack(`${drone.name}.position`, timesHover, valsHover);
        animationClips.push(new THREE.AnimationClip(`Hover_${i}`, 4, [hoverTrack]));
    }

    return { group, animationClips };
}
