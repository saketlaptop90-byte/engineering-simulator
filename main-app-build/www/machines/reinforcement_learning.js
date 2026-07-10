export function createReinforcementLearningLoop(THREE) {
    const group = new THREE.Group();

    // 1. Agent Body
    const agentGeometry = new THREE.BoxGeometry(2, 2, 2);
    const agentMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db });
    const agentBody = new THREE.Mesh(agentGeometry, agentMaterial);
    agentBody.position.set(-5, 1, 0);
    group.add(agentBody);

    // 2. Environment Grid
    const envGeometry = new THREE.PlaneGeometry(8, 8, 8, 8);
    const envMaterial = new THREE.MeshStandardMaterial({ color: 0x2ecc71, wireframe: true });
    const environmentGrid = new THREE.Mesh(envGeometry, envMaterial);
    environmentGrid.rotation.x = -Math.PI / 2;
    environmentGrid.position.set(5, 0, 0);
    group.add(environmentGrid);

    // 3. State Sensor
    const sensorGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0xf1c40f });
    const stateSensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    stateSensor.position.set(-4, 2.5, 0);
    stateSensor.rotation.z = Math.PI / 4;
    group.add(stateSensor);

    // 4. Action Actuator
    const actuatorGeometry = new THREE.ConeGeometry(0.5, 2, 16);
    const actuatorMaterial = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
    const actionActuator = new THREE.Mesh(actuatorGeometry, actuatorMaterial);
    actionActuator.position.set(-3, 1, 0);
    actionActuator.rotation.z = -Math.PI / 2;
    group.add(actionActuator);

    // 5. Reward Signal
    const rewardGeometry = new THREE.OctahedronGeometry(0.8);
    const rewardMaterial = new THREE.MeshStandardMaterial({ color: 0xf39c12, emissive: 0xf39c12, emissiveIntensity: 0.5 });
    const rewardSignal = new THREE.Mesh(rewardGeometry, rewardMaterial);
    rewardSignal.position.set(0, 4, 0);
    group.add(rewardSignal);

    // 6. Q-Table Memory
    const qTableGeometry = new THREE.BoxGeometry(3, 3, 0.5);
    const qTableMaterial = new THREE.MeshStandardMaterial({ color: 0x9b59b6, wireframe: true });
    const qTableMemory = new THREE.Mesh(qTableGeometry, qTableMaterial);
    qTableMemory.position.set(-8, 3, -3);
    group.add(qTableMemory);

    // 7. Policy Network
    const policyGeometry = new THREE.SphereGeometry(1, 16, 16);
    const policyMaterial = new THREE.MeshStandardMaterial({ color: 0x8e44ad, wireframe: true });
    const policyNetwork = new THREE.Mesh(policyGeometry, policyMaterial);
    policyNetwork.position.set(-5, 4, 0);
    group.add(policyNetwork);

    // 8. Value Function Evaluator
    const valueGeometry = new THREE.TorusGeometry(0.8, 0.2, 16, 32);
    const valueMaterial = new THREE.MeshStandardMaterial({ color: 0x1abc9c });
    const valueFunctionEvaluator = new THREE.Mesh(valueGeometry, valueMaterial);
    valueFunctionEvaluator.position.set(0, 2, 0);
    group.add(valueFunctionEvaluator);

    // 9. Exploration Module
    const explorationGeometry = new THREE.DodecahedronGeometry(0.6);
    const explorationMaterial = new THREE.MeshStandardMaterial({ color: 0xe67e22 });
    const explorationModule = new THREE.Mesh(explorationGeometry, explorationMaterial);
    explorationModule.position.set(-6, 2, 2);
    group.add(explorationModule);

    // 10. Target Network
    const targetGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const targetMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50, wireframe: true });
    const targetNetwork = new THREE.Mesh(targetGeometry, targetMaterial);
    targetNetwork.position.set(-3, 4, -2);
    group.add(targetNetwork);

    // Animation
    group.userData.animate = function(time) {
        const t = time * 0.001;
        
        // Agent hovers
        agentBody.position.y = 1 + Math.sin(t * 2) * 0.2;
        
        // Environment grid slowly rotates
        environmentGrid.rotation.z = t * 0.1;
        
        // State Sensor scans
        stateSensor.rotation.y = t * 3;
        
        // Action Actuator pulses
        actionActuator.position.x = -3 + Math.sin(t * 5) * 0.5;
        
        // Reward Signal spins and bobs
        rewardSignal.rotation.x = t;
        rewardSignal.rotation.y = t;
        rewardSignal.position.y = 4 + Math.sin(t * 3) * 0.5;
        
        // Q-Table Memory rotates
        qTableMemory.rotation.y = t * 0.5;
        qTableMemory.rotation.x = t * 0.2;
        
        // Policy Network scales
        const scale = 1 + Math.sin(t * 4) * 0.1;
        policyNetwork.scale.set(scale, scale, scale);
        
        // Value Function Evaluator spins
        valueFunctionEvaluator.rotation.z = t * 2;
        
        // Exploration module orbits agent
        explorationModule.position.x = -5 + Math.cos(t * 2) * 2;
        explorationModule.position.z = Math.sin(t * 2) * 2;
        
        // Target network slowly syncs with policy network (visual pulse)
        targetNetwork.scale.setScalar(1 + Math.sin(t * 4 - Math.PI) * 0.1);
        targetNetwork.rotation.y = -t * 0.5;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "In Reinforcement Learning, what defines the goal of the agent?",
            options: ["The action space", "The state space", "The reward signal", "The Q-table"],
            correctAnswer: 2
        },
        {
            question: "What is the exploration vs. exploitation tradeoff?",
            options: [
                "Choosing between fast training and accurate predictions",
                "Choosing between known rewarding actions and trying new actions",
                "Choosing between neural networks and decision trees",
                "Choosing between discrete and continuous action spaces"
            ],
            correctAnswer: 1
        },
        {
            question: "What does the Value Function represent?",
            options: [
                "The immediate reward of an action",
                "The expected long-term return from a given state",
                "The probability of reaching the goal",
                "The cost of taking an action"
            ],
            correctAnswer: 1
        },
        {
            question: "In Deep Q-Learning, what is the purpose of the Target Network?",
            options: [
                "To increase the learning rate",
                "To stabilize training by providing fixed targets",
                "To explore the environment randomly",
                "To reduce the action space"
            ],
            correctAnswer: 1
        },
        {
            question: "What is a Policy in reinforcement learning?",
            options: [
                "A rule that limits the agent's actions",
                "A mapping from states to actions",
                "The set of all possible environments",
                "The mathematical formula for the reward"
            ],
            correctAnswer: 1
        },
        {
            question: "What differentiates Reinforcement Learning from Supervised Learning?",
            options: [
                "It uses neural networks",
                "It requires large datasets",
                "It learns from delayed rewards instead of labeled examples",
                "It cannot handle continuous data"
            ],
            correctAnswer: 2
        }
    ];

    return group;
}
