'use client';

import { useState } from 'react';

function Counter({ users }: { users: any }) {
    const [count, setCount] = useState(0);

    console.log(users);

    return (
        <div>
            <p>There are {users.length} users</p>
            <button onClick={() => setCount((prev) => prev + 1)}>
                {count}
            </button>
        </div>
    );
}

export default Counter;
