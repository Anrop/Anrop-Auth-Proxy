FROM node:lts-alpine

# Install node dependencies for the application
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install --production

# Copy application files
COPY . /app/

# Start application
CMD ["npm", "start"]

# Declare application port
EXPOSE 3000
