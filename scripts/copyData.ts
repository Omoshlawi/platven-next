import { PrismaClient as SourcePrismaClient } from '@prisma/client_source';
import { PrismaClient as TargetPrismaClient } from '@prisma/client';

const sourcePrisma = new SourcePrismaClient();
const targetPrisma = new TargetPrismaClient();

async function copyData() {
    try {
        // Step 1: Copy Clicks (no relationships)
        const clicks = await sourcePrisma.click.findMany();
        for (const click of clicks) {
            const existingClick = await targetPrisma.click.findUnique({
                where: { id: click.id },
            });
            if (!existingClick) {
                await targetPrisma.click.create({
                    data: {
                        id: click.id,
                        count: click.count,
                    },
                });
            }
        }

        // Step 2: Copy Counties and SubCounties
        const counties = await sourcePrisma.county.findMany({
            include: { subscounties: true },
        });
        for (const county of counties) {
            const existingCounty = await targetPrisma.county.findUnique({
                where: { code: county.code },
            });
            let createdCounty;
            if (!existingCounty) {
                createdCounty = await targetPrisma.county.create({
                    data: {
                        code: county.code,
                        name: county.name,
                        capital: county.capital,
                    },
                });
            } else {
                createdCounty = existingCounty; // Use the existing county if found
            }

            for (const subCounty of county.subscounties) {
                const existingSubCounty = await targetPrisma.subCounty.findUnique({
                    where: { code: subCounty.code },
                });
                if (!existingSubCounty) {
                    await targetPrisma.subCounty.create({
                        data: {
                            code: subCounty.code,
                            countyCode: createdCounty.code,
                            name: subCounty.name,
                        },
                    });
                }
            }
        }

        // Step 3: Copy Users (with Accounts and Properties)
        const users = await sourcePrisma.user.findMany({
            include: { properties: true, accounts: true, OTPVerificatiions: true },
        });
        for (const user of users) {
            const existingUser = await targetPrisma.user.findUnique({
                where: { id: user.id },
            });
            let createdUser;
            if (!existingUser) {
                createdUser = await targetPrisma.user.create({
                    data: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        address: user.address,
                        password: user.password,
                        isActive: user.isActive,
                        isStaff: user.isStaff,
                        isSuperUser: user.isSuperUser,
                        type: user.type,
                        image: user.image,
                        identificationNumber: user.identificationNumber,
                        accountVerified: user.accountVerified,
                    },
                });
            } else {
                createdUser = existingUser; // Use the existing user if found
            }

            // Create user accounts
            for (const account of user.accounts) {
                const existingAccount = await targetPrisma.account.findUnique({
                    where: { id: account.id },
                });
                if (!existingAccount) {
                    await targetPrisma.account.create({
                        data: {
                            id: account.id,
                            userId: createdUser.id,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            createdAt: account.createdAt,
                        },
                    });
                }
            }

            // Create OTP Verifications
            for (const otp of user.OTPVerificatiions) {
                const existingOtp = await targetPrisma.oTPVerificatiion.findUnique({
                    where: { id: otp.id },
                });
                if (!existingOtp) {
                    await targetPrisma.oTPVerificatiion.create({
                        data: {
                            id: otp.id,
                            userId: createdUser.id,
                            verified: otp.verified,
                            expiry: otp.expiry,
                            createdAt: otp.createdAt,
                        },
                    });
                }
            }
        }

        // Step 4: Copy PropertyTypes (with relationships to Property)
        const propertyTypes = await sourcePrisma.propertyType.findMany({
            include: { properties: true },
        });
        for (const type of propertyTypes) {
            const existingType = await targetPrisma.propertyType.findUnique({
                where: { id: type.id },
            });
            let createdType;
            if (!existingType) {
                createdType = await targetPrisma.propertyType.create({
                    data: {
                        id: type.id,
                        title: type.title,
                        isActive: type.isActive,
                        icon: type.icon,
                    },
                });
            } else {
                createdType = existingType; // Use the existing type if found
            }

            for (const property of type.properties) {
                const existingProperty = await targetPrisma.property.findUnique({
                    where: { id: property.id },
                });
                if (!existingProperty) {
                    await targetPrisma.property.create({
                        data: {
                            id: property.id,
                            title: property.title,
                            userId: property.userId, // Ensure users are copied before this step
                            typeId: createdType.id,
                            status: property.status,
                            price: property.price,
                            county: property.county,
                            subCounty: property.subCounty,
                            landMark: property.landMark,
                            roadAccessNature: property.roadAccessNature,
                            images: property.images,
                            listed: property.listed,
                            isActive: property.isActive,
                            rejectionReason: property.rejectionReason,
                            size: property.size,
                        },
                    });
                }
            }
        }

        // Step 5: Copy Teams (related to Users)
        const teams = await sourcePrisma.team.findMany();
        for (const team of teams) {
            const existingTeam = await targetPrisma.team.findUnique({
                where: { id: team.id },
            });
            if (!existingTeam) {
                await targetPrisma.team.create({
                    data: {
                        id: team.id,
                        userId: team.userId, // Ensure users are copied before this step
                        isActive: team.isActive,
                        image: team.image,
                        position: team.position,
                    },
                });
            }
        }

        // Step 6: Copy Adverts (simple model)
        const adverts = await sourcePrisma.advert.findMany();
        for (const advert of adverts) {
            const existingAdvert = await targetPrisma.advert.findUnique({
                where: { id: advert.id },
            });
            if (!existingAdvert) {
                await targetPrisma.advert.create({
                    data: {
                        id: advert.id,
                        image: advert.image,
                        title: advert.title,
                        description: advert.description,
                        createdAt: advert.createdAt,
                        updatedAt: advert.updatedAt,
                    },
                });
            }
        }

        // Step 7: Copy PropertyRequests
        const propertyRequests = await sourcePrisma.propertyRequest.findMany();
        for (const request of propertyRequests) {
            const existingRequest = await targetPrisma.propertyRequest.findUnique({
                where: { id: request.id },
            });
            if (!existingRequest) {
                await targetPrisma.propertyRequest.create({
                    data: {
                        id: request.id,
                        propertyId: request.propertyId,
                        name: request.name,
                        email: request.email,
                        phoneNumber: request.phoneNumber,
                        isAddressed: request.isAddressed,
                        message: request.message,
                    },
                });
            }
        }

        // Step 8: Copy Payments
        const payments = await sourcePrisma.payment.findMany();
        for (const payment of payments) {
            const existingPayment = await targetPrisma.payment.findUnique({
                where: { id: payment.id },
            });
            if (!existingPayment) {
                await targetPrisma.payment.create({
                    data: {
                        id: payment.id,
                        amount: payment.amount,
                        propertyId: payment.propertyId,
                        complete: payment.complete,
                        description: payment.description,
                        merchantRequestId: payment.merchantRequestId,
                        checkoutRequestId: payment.checkoutRequestId,
                        resultCode: payment.resultCode,
                        resultDescription: payment.resultDescription,
                        mpesareceiptNumber: payment.mpesareceiptNumber,
                        transactionDate: payment.transactionDate,
                        phoneNumber: payment.phoneNumber,
                    },
                });
            }
        }

        // Step 9: Copy Contacts
        const contacts = await sourcePrisma.contact.findMany();
        for (const contact of contacts) {
            const existingContact = await targetPrisma.contact.findUnique({
                where: { id: contact.id },
            });
            if (!existingContact) {
                await targetPrisma.contact.create({
                    data: {
                        id: contact.id,
                        isAddressed: contact.isAddressed,
                        name: contact.name,
                        email: contact.email,
                        phoneNumber: contact.phoneNumber,
                        subject: contact.subject,
                        message: contact.message,
                    },
                });
            }
        }

        console.log('All data copied successfully!');
    } catch (error) {
        console.error('Error copying data:', error);
    } finally {
        await sourcePrisma.$disconnect();
        await targetPrisma.$disconnect();
    }
}

copyData();
