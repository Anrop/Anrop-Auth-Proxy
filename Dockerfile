FROM node:4.2.1

# Copy application files
COPY . /app/

# Install node dependencies for the application
WORKDIR /app
RUN npm install

# Start application
CMD ["npm", "start"]

# Declare application port
EXPOSE 3000
