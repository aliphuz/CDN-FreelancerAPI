using CDN.FreelancerAPI.Application.DTOs;
using CDN.FreelancerAPI.Application.Interfaces;
using CDN.FreelancerAPI.Application.UseCases;
using CDN.FreelancerAPI.Domain.Entities;
using Moq;
using Xunit;

namespace CDN.FreelancerAPI.UnitTests;

public class FreelancerServiceTests
{
    private readonly Mock<IFreelancerRepository> _mockRepository;
    private readonly FreelancerService _service;

    public FreelancerServiceTests()
    {
        _mockRepository = new Mock<IFreelancerRepository>();
        _service = new FreelancerService(_mockRepository.Object);
    }

    [Fact]
    public async Task CreateFreelancerAsync_ShouldReturnFreelancer_WhenValidDto()
    {
        // Arrange
        var dto = new CreateFreelancerDto
        {
            Username = "testuser",
            Email = "test@example.com",
            Phone = "1234567890",
            Skillsets = new List<string> { "C#", "JavaScript" },
            Hobbies = new List<string> { "Reading", "Gaming" }
        };

        var expectedFreelancer = new Freelancer
        {
            Id = 1,
            Username = dto.Username,
            Email = dto.Email,
            Phone = dto.Phone
        };

        _mockRepository.Setup(r => r.CreateAsync(It.IsAny<Freelancer>()))
                      .ReturnsAsync(expectedFreelancer);

        // Act
        var result = await _service.CreateFreelancerAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(dto.Username, result.Username);
        Assert.Equal(dto.Email, result.Email);
        Assert.Equal(dto.Phone, result.Phone);
        _mockRepository.Verify(r => r.CreateAsync(It.IsAny<Freelancer>()), Times.Once);
    }

    [Fact]
    public async Task GetFreelancerByIdAsync_ShouldReturnFreelancer_WhenExists()
    {
        // Arrange
        var freelancerId = 1;
        var expectedFreelancer = new Freelancer
        {
            Id = freelancerId,
            Username = "testuser",
            Email = "test@example.com",
            Phone = "1234567890"
        };

        _mockRepository.Setup(r => r.GetByIdAsync(freelancerId))
                      .ReturnsAsync(expectedFreelancer);

        // Act
        var result = await _service.GetFreelancerByIdAsync(freelancerId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(freelancerId, result.Id);
        Assert.Equal(expectedFreelancer.Username, result.Username);
        _mockRepository.Verify(r => r.GetByIdAsync(freelancerId), Times.Once);
    }

    [Fact]
    public async Task GetFreelancerByIdAsync_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        var freelancerId = 999;
        _mockRepository.Setup(r => r.GetByIdAsync(freelancerId))
                      .ReturnsAsync((Freelancer?)null);

        // Act
        var result = await _service.GetFreelancerByIdAsync(freelancerId);

        // Assert
        Assert.Null(result);
        _mockRepository.Verify(r => r.GetByIdAsync(freelancerId), Times.Once);
    }
}