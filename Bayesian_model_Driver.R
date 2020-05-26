#------------------------------------------------------------------------------- 
# Optional generic preliminaries:
graphics.off() # This closes all of R's graphics windows.
rm(list=ls())  # Careful! This clears all of R's memory!
#------------------------------------------------------------------------------- 
# Read the data 
myData = read.csv("BayesR.csv")
contrasts = list( 
  list( c("01") , c("07") , compVal=0.0 , ROPE=NULL ) ,
  list( c("07") , c("16") , compVal=0.0 , ROPE=NULL ) 
)
fileNameRoot = "BattingAverage-logistic-" 
graphFileType = "eps" 
#------------------------------------------------------------------------------- 
# Load the relevant model into R's working memory:
source("Bayesian_model.R")
# Generate the MCMC chain:
#startTime = proc.time()
mcmcCoda = genMCMC( datFrm=myData, yName="WinR", NName="TotalG", xName="Seed",
                    numSavedSteps=15000 , thinSteps=10 , saveName=fileNameRoot )
#stopTime = proc.time()
#elapsedTime = stopTime - startTime
#show(elapsedTime)
#------------------------------------------------------------------------------- 
# Display diagnostics of chain, for specified parameters:
parameterNames = varnames(mcmcCoda) # get all parameter names for reference
for ( parName in c("b0","b[1]","omega[1]","kappa") ) { 
  diagMCMC( codaObject=mcmcCoda , parName=parName , 
                saveName=fileNameRoot , saveType=graphFileType )
}
#------------------------------------------------------------------------------- 
print("summarystart")
# Get summary statistics of chain:
summaryInfo = smryMCMC( mcmcCoda , contrasts=NULL ,
                        datFrm=myData, xName="Seed",
                        #yName="Hits", NName="AtBats", 
                        saveName=fileNameRoot )
show(summaryInfo)

print("summaryend")
# Display posterior information:
plotMCMC( mcmcCoda , contrasts=NULL ,
          datFrm=myData, xName="Seed", yName="WinR", NName="TotalG", 
          saveName=fileNameRoot , saveType=graphFileType )
#------------------------------------------------------------------------------- 
