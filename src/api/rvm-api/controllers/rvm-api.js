'use strict';

module.exports = {
    // 1. getProfile Enpoint to get user profile by phone number
    async getProfile(ctx) {
        try {
            // Extract telNumber from the request body
            const { telNumber } = ctx.request.body;
      
            // Validate that the phone number is provided
            if (!telNumber) {
              return ctx.badRequest('Phone number is required.');
            }
      
            // Call a service to get the user profile (this can be a database query)
            const userProfile = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: { telNumber },
                limit: 1,  // Ensure only one user is returned
                fields: ['username', 'fullName', 'point'],  // Specify fields you want
            });
        
            // If a user is found, return their profile, otherwise return a 404
            if (userProfile.length > 0) {
                const response = {
                    username: userProfile[0].username,
                    fullName: userProfile[0].fullName,
                    totalPoint: userProfile[0].point,
                }
                ctx.send(response);
            } else {
                ctx.notFound('User not found.');
            }
        } catch (error) {
            // Handle unexpected errors
            ctx.internalServerError('Something went wrong.');
        }
    },
    // 4. Calculate bottle points based on the formula from Strapi
    async calculatedBottlePoints(ctx) {
        try {
            // Get the JSON data from the request body
            const data = ctx.request.body;

            // Validate input data: It should be a non-empty array
            if (!data || !Array.isArray(data)) {
            return ctx.badRequest("Invalid input");
            }

            // Fetch formula data for bottles from Strapi (assuming `bottle-formulas` collection)
            const formula_data = await strapi.entityService.findMany('api::formula.formula', {
                fields: ['size', 'point'],  // Fetching only the size and point fields
            });

            // If no formula data is found, return a server error
            if (!formula_data) {
                return ctx.internalServerError("Internal server error");
            }

            // Create a dictionary mapping bottle size to points
            const size_point_mapping = {};
            formula_data.forEach(formula => {
                size_point_mapping[formula.size] = formula.point;
            });

            let total_bottles = 0;
            let earned_points = 0;

            // Calculate total bottles and earned points based on input data and formula from Strapi
            for (const item of data) {
                const bottle_size = item.bottleSize;
                const quantity = item.quantity;

                // Validate that bottle_size is provided and quantity is a number
                if (!bottle_size || typeof quantity !== 'number') {
                    return ctx.badRequest("Invalid input");
                }

                // Get points for the given bottle size, default to 0 if size not found
                const points_per_bottle = size_point_mapping[bottle_size] || 0;
                total_bottles += quantity;

                if (points_per_bottle) {
                    earned_points += points_per_bottle * quantity;
                }
            }

            // Send the calculated points and total bottles as response
            ctx.send({
                earnedPoints: earned_points,
                totalBottles: total_bottles
            });
        } catch (error) {
            // Handle unexpected errors
            ctx.internalServerError('Something went wrong.');
        }
    },
    // 5. Calculate can points based on the formula from Strapi
    async calculatedCanPoints(ctx) {
        const data = ctx.request.body;
        // Validate input data: It should be a non-empty array
        if (!data || !Array.isArray(data)) {
            return ctx.badRequest({ error: "Invalid input" });
        }
        try {
            // Fetch formula data for cans from Strapi
            const formula_data = await strapi.entityService.findMany('api::formula.formula', {
                fields: ['size', 'point'],  // Fetch only size and point fields
            });

            // If no formula data is found, return a server error
            if (!formula_data) {
                return ctx.internalServerError("Internal server error");
            }

            // Create a dictionary mapping can size to points
            const size_point_mapping = {};
            formula_data.forEach(formula => {
                size_point_mapping[formula.size] = formula.point;
            });

            let total_cans = 0;
            let earned_points = 0;

            // Calculate total cans and earned points based on input data and formula from Strapi
            for (const item of data) {
                const can_size = item.canSize;
                const quantity = item.quantity;

                // Validate that can_size is provided and quantity is a number
                if (!can_size || typeof quantity !== 'number') {
                return ctx.badRequest({ error: "Invalid input" });
                }

                // Get points for the given can size, default to 0 if size not found
                const points_per_can = size_point_mapping[can_size] || 0;
                total_cans += quantity;

                if (points_per_can) {
                    earned_points += points_per_can * quantity;
                }
            }

            // Send the calculated points and total cans as the response
            return ctx.send({
                earnedPoints: earned_points,
                totalCans: total_cans
            });
        } catch (error) {
            // Handle unexpected errors
            ctx.internalServerError('Something went wrong.');
        }
    },
    // 6. Accumulate points for the user based on the recycling machine data
    async accumulatePoints(ctx) {
        try {
            // Get data from request body
            const { telNumber, serialNumber, earnedPoints, data } = ctx.request.body;
    
            // Validate input data
            if (!telNumber || typeof telNumber !== 'string' ||
                !serialNumber || typeof serialNumber !== 'string' ||
                !earnedPoints || typeof earnedPoints !== 'number' ||
                !Array.isArray(data)) {
                return ctx.badRequest({ error: "Invalid input" });
            }
    
            // Search for the user by phone number in the database
            const user = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: { telNumber: telNumber },
                limit: 1,
            });
    
            // If the user is not found
            if (!user || user.length === 0) {
                return ctx.notFound({ error: "User not found" });
            }
    
            // Check if the recycling machine exists using the serial number
            const rvm = await strapi.entityService.findMany('api::recycle-machine.recycle-machine', {
                filters: { serialNumber: serialNumber },
                limit: 1,
            });
    
            // If the recycling machine is not found
            if (!rvm || rvm.length === 0) {
                return ctx.notFound({ error: "Recycling machine not found" });
            }
    
            // Accumulate the earned points for the user
            const currentTotalPoints = user[0].point || 0; // Get existing points or 0
            const newTotalPoints = currentTotalPoints + earnedPoints;
    
            // Update the user's total points in the database
            await strapi.entityService.update('plugin::users-permissions.user', user[0].id, {
                data: {
                    point: newTotalPoints
                },
            });
    
            // Get the current date and time
            const currentDate = new Date();
            const depositDate = currentDate.toISOString().split('T')[0];  // Format: YYYY-MM-DD
            const depositTime = currentDate.toTimeString().split(' ')[0];  // Format: HH:MM:SS
            const contribrute = "accumulate";
    
            // Loop through the data (cans) and save each record to the history-machine
            for (const item of data) {
                const size = item.canSize || item.bottleSize; // Check for canSize or bottleSize
                const quantity = item.quantity;

                // Add new record to the history-machine collection
                await strapi.entityService.create('api::history-machine.history-machine', {
                    data: {
                        serialNumber: serialNumber,
                        point: earnedPoints,   // Points for this transaction
                        date: depositDate,
                        time: depositTime,
                        user: user[0].id,
                        cabinet: rvm[0].id,   // Assuming the recycling machine is stored in a "cabinet" field
                        size: size,
                        quantity: quantity,
                        telNumber: telNumber,
                        contribrute: contribrute,
                    },
                });
            }
    
            // Return success response with the deposit date and total accumulated points
            return ctx.send({
                depositDate: depositDate,
                totalPoints: newTotalPoints
            });
    
        } catch (error) {
            // Handle any unexpected errors
            console.error("Error accumulating points:", error);
            return ctx.internalServerError({ error: "Internal server error" });
        }
    },
    // 7. Donation endpoint to save donation data to the database
    async donate(ctx) {
        try {
            // Get data from request body
            const { telNumber, serialNumber, earnedPoints, data } = ctx.request.body;
    
            // Validate input data
            if (!telNumber || typeof telNumber !== 'string' ||
                !serialNumber || typeof serialNumber !== 'string' ||
                !earnedPoints || typeof earnedPoints !== 'number' ||
                !Array.isArray(data)) {
                return ctx.badRequest({ error: "Invalid input" });
            }
    
            // Search for the user by phone number in the database
            const user = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: { telNumber },
                limit: 1,
            });
    
            // If the user is not found
            if (!user || user.length === 0) {
                return ctx.notFound({ error: "User not found" });
            }
    
            // Check if the recycling machine exists using the serial number
            const rvm = await strapi.entityService.findMany('api::recycle-machine.recycle-machine', {
                filters: { serialNumber },
                limit: 1,
            });
    
            // If the recycling machine is not found
            if (!rvm || rvm.length === 0) {
                return ctx.notFound({ error: "Recycling machine not found" });
            }
    
            // Accumulate the earned points for the user
            const currentTotalPoints = user[0].point || 0; // Get existing points or 0
            const newTotalPoints = currentTotalPoints + earnedPoints;
    
            // Update the user's total points in the database
            await strapi.entityService.update('plugin::users-permissions.user', user[0].id, {
                data: {
                    point: newTotalPoints
                },
            });
    
            // Get the current date and time
            const currentDate = new Date();
            const depositDate = currentDate.toISOString().split('T')[0];  // Format: YYYY-MM-DD
            const depositTime = currentDate.toTimeString().split(' ')[0];  // Format: HH:MM:SS
            const contribrute = "accumulate";
    
            // Loop through the data (cans) and save each record to the history-machine
            for (const item of data) {
                const size = item.canSize || item.bottleSize; // Check for canSize or bottleSize
                const quantity = item.quantity;
    
                // Add new record to the history-machine collection
                await strapi.entityService.create('api::history-machine.history-machine', {
                    data: {
                        serialNumber: serialNumber,
                        point: earnedPoints,   // Points for this transaction
                        date: depositDate,
                        time: depositTime,
                        user: user[0].id,
                        cabinet: rvm[0].id,   // Assuming the recycling machine is stored in a "cabinet" field
                        size,
                        quantity,
                        telNumber,
                        contribrute,
                    },
                });
            }
    
            // Prepare the data to be saved
            const donationData = {
                telNumber: telNumber,
                // You can add more fields related to the donation here, if needed
            };
        
            // Save the donation data to the Strapi database
            await strapi.entityService.create('api::donate.donate', {
                data: donationData,
            });
        
            // Send success response
            return ctx.send({
                message: "Donation data saved successfully",
            });
    
        } catch (error) {
            // Handle any unexpected errors
            console.error("Error accumulating points:", error);
            return ctx.internalServerError({ error: "Internal server error" });
        }
    },
    // 8. Get activate data by phone number
    async activate(ctx) {
        try {
            const { serialNumber } = ctx.request.body;
        
            // Validate the serial number input
            if (!serialNumber || typeof serialNumber !== 'string') {
                return ctx.badRequest({ error: 'Invalid serial number' });
            }
        
            // Fetch machine data based on serial number
            const machines = await strapi.entityService.findMany('api::recycle-machine.recycle-machine', {
                filters: { serialNumber },
                limit: 1,  // We expect a unique serial number, so limit to one result
            });
        
            // If no machine is found, return 404
            if (!machines || machines.length === 0) {
                return ctx.notFound({ error: 'Machine not found' });
            }
        
            // Get the first machine found
            const machine = machines[0];
            const activated = machine.activated;
        
            // Check if the machine is already activated
            if (activated) {
                return ctx.badRequest({
                    error: 'The machine has already been activated. Duplicate activation is not allowed.'
                });
            }
        
            // If not activated, update the machine's activated status to true
            const machineId = machine.id;
        
            // Update the machine's activated status in Strapi
            await strapi.entityService.update('api::recycle-machine.recycle-machine', machineId, {
                data: { activated: true },
            });
        
            // Send success response
            return ctx.send({
                serialNumber: serialNumber,
                status: 'The machine is activated now',
            }, 200);
        
        } catch (error) {
            // If an error occurs, log it and return a 500 error
            console.error('Error activating machine:', error);
            return ctx.internalServerError({ error: 'Failed to process the request' });
        }
    },

    // 9. Heartbeat endpoint to check the status of the RVM machine
    async heartbeat(ctx) {
        try {
            // Get the serial number from the request body
            const { serialNumber } = ctx.request.body;
        
            // Validate that the serial number is provided and is a string
            if (!serialNumber || typeof serialNumber !== 'string') {
                return ctx.badRequest({ error: "Invalid serial number" });
            }
        
            // Search for the RVM machine by serial number in the database
            const rvm = await strapi.entityService.findMany('api::recycle-machine.recycle-machine', {
                filters: { serialNumber },
                limit: 1, // We only need one RVM to be returned
            });
        
            // If the RVM with the provided serial number is not found
            if (!rvm || rvm.length === 0) {
                return ctx.notFound({ error: "RVM not found" });
            }
        
            // Assuming there's a field 'status' that indicates whether the RVM is online or offline
            const rvmStatus = rvm[0].status || "offline"; // Default to "offline" if the status is missing
        
            // Send success response with the RVM status
            return ctx.send({
                serialNumber: serialNumber,
                status: rvmStatus,
            });
    
        } catch (error) {
            // Handle any unexpected errors
            console.error("Error checking RVM status:", error);
            return ctx.internalServerError({ error: "Internal server error" });
        }
    },
};